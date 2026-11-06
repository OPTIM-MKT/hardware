import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { cartStore } from "../cart/cart-store";
import {
  PRODUCT_SECTIONS,
  SECTION_QUERY_PARAM,
} from "../../constants/product-sections";
import { CATALOG_JSON_URL, CATALOG_PAGE_SIZE } from "./catalog-data";

export interface CatalogProduct {
  slug: string;
  nombre: string;
  marca: string;
  categoria: string;
  subcategoria?: string;
  seccion?: string;
  descripcion: string;
  imagen?: string;
  disponible: boolean;
  destacado: boolean;
  nuevo: boolean;
  sku?: string;
  tags: string[];
  /** true = viene del catálogo extendido (src/content/productos/vexin). */
  extendido: boolean;
}

interface Props {
  /** Primera página (orden por relevancia) para el primer pintado. */
  initialProducts: CatalogProduct[];
  /** Total de productos del catálogo completo. */
  total: number;
  /** Opciones de marca y categoría, disponibles antes de descargar el JSON. */
  facets: { marcas: string[]; categorias: string[] };
  children?: React.ReactNode;
}

type SortKey = "relevancia" | "nombre" | "nuevo" | "destacado";
type CatalogoKey = "all" | "seleccion" | "extendido";
type LoadStatus = "loading" | "ready" | "error";

interface Filters {
  query: string;
  marca: string;
  categoria: string;
  subcategoria: string;
  seccion: string;
  catalogo: CatalogoKey;
  soloDisponibles: boolean;
  sort: SortKey;
}

const DEFAULT_FILTERS: Filters = {
  query: "",
  marca: "all",
  categoria: "all",
  subcategoria: "all",
  seccion: "all",
  catalogo: "all",
  soloDisponibles: false,
  sort: "relevancia",
};

const SORT_KEYS: SortKey[] = ["relevancia", "nombre", "nuevo", "destacado"];
const CATALOGO_OPTIONS: { value: CatalogoKey; label: string }[] = [
  { value: "all", label: "Todo el catálogo" },
  { value: "seleccion", label: "Selección Hard-Ware" },
  { value: "extendido", label: "Catálogo extendido" },
];

// Parámetros de URL: permiten compartir una búsqueda y que "atrás" desde la
// ficha de un producto regrese a la misma página y filtros.
const PARAM = {
  query: "q",
  marca: "marca",
  categoria: "categoria",
  subcategoria: "sub",
  seccion: SECTION_QUERY_PARAM,
  catalogo: "catalogo",
  soloDisponibles: "disponibles",
  sort: "orden",
  page: "pagina",
} as const;

// Panel de filtros: sin barra de scroll visible; un desvanecido en el borde
// inferior sigue indicando que hay más opciones abajo.
const HIDDEN_SCROLLBAR =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";
const SCROLL_EDGE_FADE =
  "[mask-image:linear-gradient(to_bottom,black_calc(100%-2rem),transparent)]";

const numberFormat = new Intl.NumberFormat("es-MX");
const collator = new Intl.Collator("es", { sensitivity: "base", numeric: true });

/** Minúsculas y sin acentos: "cámara" encuentra "camara" y viceversa. */
const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function readUrlState(): { filters: Filters; page: number } {
  const params = new URLSearchParams(window.location.search);
  const get = (key: string) => params.get(key)?.trim() || undefined;

  const seccion = get(PARAM.seccion);
  const sort = get(PARAM.sort) as SortKey | undefined;
  const catalogo = get(PARAM.catalogo) as CatalogoKey | undefined;
  const page = Number(get(PARAM.page));

  return {
    filters: {
      query: get(PARAM.query) ?? "",
      marca: get(PARAM.marca) ?? "all",
      categoria: get(PARAM.categoria) ?? "all",
      subcategoria: get(PARAM.subcategoria) ?? "all",
      seccion:
        seccion && PRODUCT_SECTIONS.some((s) => s.id === seccion)
          ? seccion
          : "all",
      catalogo:
        catalogo && CATALOGO_OPTIONS.some((o) => o.value === catalogo)
          ? catalogo
          : "all",
      soloDisponibles: get(PARAM.soloDisponibles) === "1",
      sort: sort && SORT_KEYS.includes(sort) ? sort : "relevancia",
    },
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

function writeUrlState(filters: Filters, page: number) {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set(PARAM.query, filters.query.trim());
  if (filters.marca !== "all") params.set(PARAM.marca, filters.marca);
  if (filters.categoria !== "all") params.set(PARAM.categoria, filters.categoria);
  if (filters.subcategoria !== "all")
    params.set(PARAM.subcategoria, filters.subcategoria);
  if (filters.seccion !== "all") params.set(PARAM.seccion, filters.seccion);
  if (filters.catalogo !== "all") params.set(PARAM.catalogo, filters.catalogo);
  if (filters.soloDisponibles) params.set(PARAM.soloDisponibles, "1");
  if (filters.sort !== "relevancia") params.set(PARAM.sort, filters.sort);
  if (page > 1) params.set(PARAM.page, String(page));

  const search = params.toString();
  const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
  if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.history.replaceState(window.history.state, "", url);
  }
}

type Counts = Map<string, number>;
const bump = (counts: Counts, key: string | undefined) => {
  if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
};

export default function ProductCatalog({
  initialProducts,
  total,
  facets,
  children,
}: Props) {
  const [products, setProducts] = useState<CatalogProduct[]>(initialProducts);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [urlReady, setUrlReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // 1) Estado inicial desde la URL (después de hidratar para no desfasar el SSR).
  useEffect(() => {
    const { filters: fromUrl, page } = readUrlState();
    setFilters(fromUrl);
    setCurrentPage(page);
    setUrlReady(true);
  }, []);

  // 2) Catálogo completo desde el JSON estático.
  const loadCatalog = useCallback(() => {
    setStatus("loading");
    const controller = new AbortController();
    fetch(CATALOG_JSON_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<CatalogProduct[]>;
      })
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => loadCatalog(), [loadCatalog]);

  // 3) Sincroniza filtros y página con la URL.
  useEffect(() => {
    if (urlReady) writeUrlState(filters, currentPage);
  }, [filters, currentPage, urlReady]);

  const updateFilters = useCallback((patch: Partial<Filters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      // La subcategoría depende de la categoría elegida.
      if (patch.categoria !== undefined && patch.categoria !== prev.categoria) {
        next.subcategoria = "all";
      }
      return next;
    });
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  // Índice de búsqueda: se calcula una vez por catálogo, no en cada tecla.
  const searchIndex = useMemo(
    () =>
      products.map((p) =>
        fold(
          [
            p.nombre,
            p.marca,
            p.categoria,
            p.subcategoria ?? "",
            p.descripcion,
            p.sku ?? "",
            ...p.tags,
          ].join(" "),
        ),
      ),
    [products],
  );

  const deferredQuery = useDeferredValue(filters.query);

  // Un solo recorrido: resultados + conteos por faceta (cada conteo respeta
  // todos los filtros excepto el suyo, para que las cifras sean honestas).
  const { filtered, counts } = useMemo(() => {
    const tokens = fold(deferredQuery).split(/\s+/).filter(Boolean);
    const { marca, categoria, subcategoria, seccion, catalogo, soloDisponibles } =
      filters;
    const result: CatalogProduct[] = [];
    const counts = {
      marca: new Map() as Counts,
      categoria: new Map() as Counts,
      subcategoria: new Map() as Counts,
      catalogo: new Map() as Counts,
    };

    products.forEach((p, i) => {
      const base =
        (seccion === "all" || p.seccion === seccion) &&
        (!soloDisponibles || p.disponible) &&
        (tokens.length === 0 ||
          tokens.every((t) => searchIndex[i].includes(t)));
      if (!base) return;

      const okMarca = marca === "all" || p.marca === marca;
      const okCategoria = categoria === "all" || p.categoria === categoria;
      const okSub = subcategoria === "all" || p.subcategoria === subcategoria;
      const okCatalogo =
        catalogo === "all" ||
        (catalogo === "extendido" ? p.extendido : !p.extendido);

      if (okCategoria && okSub && okCatalogo) bump(counts.marca, p.marca);
      if (okMarca && okCatalogo) bump(counts.categoria, p.categoria);
      if (okMarca && okCategoria && okCatalogo)
        bump(counts.subcategoria, p.subcategoria);
      if (okMarca && okCategoria && okSub)
        bump(counts.catalogo, p.extendido ? "extendido" : "seleccion");

      if (okMarca && okCategoria && okSub && okCatalogo) result.push(p);
    });

    // El JSON ya llega ordenado por relevancia; los demás órdenes son estables.
    switch (filters.sort) {
      case "nombre":
        result.sort((a, b) => collator.compare(a.nombre, b.nombre));
        break;
      case "nuevo":
        result.sort((a, b) => Number(b.nuevo) - Number(a.nuevo));
        break;
      case "destacado":
        result.sort((a, b) => Number(b.destacado) - Number(a.destacado));
        break;
    }

    return { filtered: result, counts };
  }, [products, searchIndex, deferredQuery, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / CATALOG_PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * CATALOG_PAGE_SIZE;
  const paginatedProducts = filtered.slice(
    pageStart,
    pageStart + CATALOG_PAGE_SIZE,
  );

  const goToPage = (next: number) => {
    setCurrentPage(Math.min(Math.max(1, next), totalPages));
    const el = rootRef.current;
    if (el) {
      // Debajo del navbar fijo, al inicio del catálogo (no al tope de la página).
      const top = el.getBoundingClientRect().top + window.scrollY - 112;
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  const loaded = status === "ready";
  const hasFilters =
    filters.query.trim() !== "" ||
    filters.marca !== "all" ||
    filters.categoria !== "all" ||
    filters.subcategoria !== "all" ||
    filters.seccion !== "all" ||
    filters.catalogo !== "all" ||
    filters.soloDisponibles;

  // Mientras llega el JSON, solo la vista por defecto es fiel (es el SSR);
  // con filtros o en otra página mostramos esqueletos en vez de "sin resultados".
  const waiting = !loaded && (hasFilters || page > 1);

  const seccionTitle = PRODUCT_SECTIONS.find(
    (s) => s.id === filters.seccion,
  )?.title;

  const subcategorias = useMemo(() => {
    if (filters.categoria === "all") return [];
    return [...counts.subcategoria.keys()].sort(collator.compare);
  }, [counts.subcategoria, filters.categoria]);

  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.query.trim())
    activeChips.push({
      label: `“${filters.query.trim()}”`,
      clear: () => updateFilters({ query: "" }),
    });
  if (seccionTitle)
    activeChips.push({
      label: seccionTitle,
      clear: () => updateFilters({ seccion: "all" }),
    });
  if (filters.catalogo !== "all")
    activeChips.push({
      label: CATALOGO_OPTIONS.find((o) => o.value === filters.catalogo)!.label,
      clear: () => updateFilters({ catalogo: "all" }),
    });
  if (filters.marca !== "all")
    activeChips.push({
      label: filters.marca,
      clear: () => updateFilters({ marca: "all" }),
    });
  if (filters.categoria !== "all")
    activeChips.push({
      label: filters.categoria,
      clear: () => updateFilters({ categoria: "all" }),
    });
  if (filters.subcategoria !== "all")
    activeChips.push({
      label: filters.subcategoria,
      clear: () => updateFilters({ subcategoria: "all" }),
    });
  if (filters.soloDisponibles)
    activeChips.push({
      label: "Solo disponibles",
      clear: () => updateFilters({ soloDisponibles: false }),
    });

  const panel = (
    <FiltersPanel
      filters={filters}
      onChange={updateFilters}
      onReset={resetFilters}
      hasFilters={hasFilters}
      marcas={facets.marcas}
      categorias={facets.categorias}
      subcategorias={subcategorias}
      counts={loaded ? counts : null}
    />
  );

  const resultCount = loaded ? filtered.length : total;

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start"
    >
      {/* Mobile filters trigger */}
      <div className="md:hidden flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-line text-sm font-semibold text-primary dark:text-accent hover:border-primary hover:text-primary dark:hover:text-accent active:scale-[0.97] transition-[color,border-color,transform] duration-100 cursor-pointer motion-reduce:transform-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4.5h18M5.25 12h13.5M9.75 19.5h4.5"
            />
          </svg>
          Filtros
          {activeChips.length > 0 && (
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-accent text-primary text-[11px] font-bold leading-5 text-center tabular-nums">
              {activeChips.length}
            </span>
          )}
        </button>
        <SortSelect
          value={filters.sort}
          onChange={(sort) => updateFilters({ sort })}
          compact
        />
      </div>

      {/* Desktop filters */}
      <aside
        className={`hidden md:block sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain pb-8 ${HIDDEN_SCROLLBAR} ${SCROLL_EDGE_FADE}`}
        aria-label="Filtros del catálogo"
      >
        {panel}
      </aside>

      {/* Mobile drawer: entra y sale por la izquierda, por donde vino. */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="ov"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              key="dr"
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              initial={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              transition={
                reduceMotion
                  ? { duration: 0.2 }
                  : { type: "spring", bounce: 0, duration: 0.35 }
              }
              data-surface="panel"
              className="fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <h3 className="text-lg font-bold text-primary dark:text-accent">
                  Filtros
                </h3>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Cerrar"
                  className="w-9 h-9 rounded-full hover:bg-line/60 flex items-center justify-center cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div
                className={`flex-1 overflow-y-auto overscroll-contain px-6 pb-8 ${HIDDEN_SCROLLBAR} ${SCROLL_EDGE_FADE}`}
              >
                {panel}
              </div>
              <div className="px-6 py-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-3 rounded-full bg-primary text-white text-sm font-semibold active:scale-[0.98] transition-transform duration-100 cursor-pointer motion-reduce:transform-none"
                >
                  Ver {numberFormat.format(resultCount)}{" "}
                  {resultCount === 1 ? "producto" : "productos"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section aria-label="Resultados" className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-4">
          <p className="text-sm text-muted tabular-nums" aria-live="polite">
            <span className="font-semibold text-ink dark:text-white">
              {numberFormat.format(resultCount)}
            </span>{" "}
            {resultCount === 1 ? "producto" : "productos"}
            {seccionTitle && ` en ${seccionTitle}`}
            {loaded && filtered.length > CATALOG_PAGE_SIZE && (
              <span className="hidden sm:inline">
                {" "}
                · mostrando {numberFormat.format(pageStart + 1)}–
                {numberFormat.format(pageStart + paginatedProducts.length)}
              </span>
            )}
          </p>
          <div className="hidden md:block">
            <SortSelect
              value={filters.sort}
              onChange={(sort) => updateFilters({ sort })}
            />
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.clear}
                aria-label={`Quitar filtro ${chip.label}`}
                className="group/chip inline-flex items-center gap-1.5 max-w-full pl-3 pr-2 py-1 rounded-full bg-primary/8 dark:bg-accent/10 text-xs font-semibold text-primary dark:text-accent hover:bg-primary/12 dark:hover:bg-accent/15 active:scale-[0.97] transition-[background-color,transform] duration-100 cursor-pointer motion-reduce:transform-none"
              >
                <span className="truncate">{chip.label}</span>
                <svg
                  className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover/chip:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ))}
            {activeChips.length > 1 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-muted hover:text-primary dark:hover:text-accent underline underline-offset-4 cursor-pointer px-1"
              >
                Limpiar todo
              </button>
            )}
          </div>
        )}

        {status === "error" && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm text-ink dark:text-white"
          >
            <span>
              No pudimos cargar el catálogo completo. Mostramos solo los
              primeros productos.
            </span>
            <button
              type="button"
              onClick={loadCatalog}
              className="text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline underline-offset-4 cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {waiting ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            aria-busy="true"
            aria-label="Cargando productos"
          >
            {Array.from({ length: CATALOG_PAGE_SIZE }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          children ? (
            children
          ) : (
            <div className="bento-card flex flex-col items-center text-center py-16 gap-3">
              <p className="text-base font-semibold text-ink dark:text-white">
                Sin resultados
              </p>
              <p className="text-sm text-muted max-w-sm">
                No encontramos productos con esos criterios. Prueba con el
                número de parte, otra palabra o quita algún filtro.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-2 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          )
        ) : (
          <>
            {/* Cross-fade corto al cambiar de página o filtros. */}
            <motion.div
              key={`${page}|${filtered.length}|${filters.sort}`}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </motion.div>

            {loaded && totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={goToPage}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Filtros                                                                     */
/* -------------------------------------------------------------------------- */

function FiltersPanel({
  filters,
  onChange,
  onReset,
  hasFilters,
  marcas,
  categorias,
  subcategorias,
  counts,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  hasFilters: boolean;
  marcas: string[];
  categorias: string[];
  subcategorias: string[];
  /** null mientras el catálogo completo no ha llegado. */
  counts: {
    marca: Counts;
    categoria: Counts;
    subcategoria: Counts;
    catalogo: Counts;
  } | null;
}) {
  const catalogoTotal = counts
    ? (counts.catalogo.get("seleccion") ?? 0) +
      (counts.catalogo.get("extendido") ?? 0)
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label
          htmlFor="catalog-search"
          className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2 block"
        >
          Buscar
        </label>
        <div className="relative">
          <input
            id="catalog-search"
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Modelo o número de parte"
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-10 pr-4 py-3 rounded-full text-sm text-ink bg-canvas border border-line placeholder:text-muted focus:outline-none focus:border-primary dark:focus:border-accent transition-colors"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.34-4.34M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
            />
          </svg>
        </div>
      </div>

      <FilterGroup
        label="Catálogo"
        name="catalogo"
        value={filters.catalogo}
        onChange={(v) => onChange({ catalogo: v as CatalogoKey })}
        allLabel={CATALOGO_OPTIONS[0].label}
        allCount={catalogoTotal}
        options={CATALOGO_OPTIONS.slice(1).map((o) => ({
          value: o.value,
          label: o.label,
          count: counts?.catalogo.get(o.value),
        }))}
        counted={Boolean(counts)}
      />

      <FilterGroup
        label="Marca"
        name="marca"
        value={filters.marca}
        onChange={(v) => onChange({ marca: v })}
        options={marcas.map((m) => ({
          value: m,
          label: m,
          count: counts?.marca.get(m),
        }))}
        counted={Boolean(counts)}
        collapseAfter={6}
      />

      <FilterGroup
        label="Categoría"
        name="categoria"
        value={filters.categoria}
        onChange={(v) => onChange({ categoria: v })}
        options={categorias.map((c) => ({
          value: c,
          label: c,
          count: counts?.categoria.get(c),
        }))}
        counted={Boolean(counts)}
        collapseAfter={8}
      />

      {subcategorias.length > 0 && (
        <FilterGroup
          label={`Tipo · ${filters.categoria}`}
          name="subcategoria"
          value={filters.subcategoria}
          onChange={(v) => onChange({ subcategoria: v })}
          options={subcategorias.map((s) => ({
            value: s,
            label: s,
            count: counts?.subcategoria.get(s),
          }))}
          counted={Boolean(counts)}
        />
      )}

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.soloDisponibles}
          onChange={(e) => onChange({ soloDisponibles: e.target.checked })}
          className="w-4 h-4 rounded border-line accent-primary dark:accent-accent"
        />
        <span className="text-sm text-ink dark:text-white">
          Solo disponibles
        </span>
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline underline-offset-4 self-start cursor-pointer"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

function FilterGroup({
  label,
  name,
  value,
  onChange,
  options,
  counted,
  allLabel = "Todas",
  allCount,
  collapseAfter,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
  /** true cuando ya hay conteos: oculta opciones sin resultados. */
  counted: boolean;
  allLabel?: string;
  allCount?: number;
  collapseAfter?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  // Con conteos, las opciones vacías estorban; la seleccionada siempre queda.
  const visible = counted
    ? options.filter((o) => (o.count ?? 0) > 0 || o.value === value)
    : options;

  const canCollapse = collapseAfter !== undefined && visible.length > collapseAfter + 2;
  let shown = visible;
  if (canCollapse && !expanded) {
    shown = visible.slice(0, collapseAfter);
    // Si la opción elegida quedaría oculta, la mostramos igualmente.
    const selected = visible.find((o) => o.value === value);
    if (selected && !shown.includes(selected)) shown = [...shown, selected];
  }

  return (
    <fieldset>
      <legend className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">
        {label}
      </legend>
      <div className="flex flex-col gap-0.5">
        <FilterOptionRow
          name={name}
          checked={value === "all"}
          onSelect={() => onChange("all")}
          label={allLabel}
          count={allCount}
        />
        {shown.map((opt) => (
          <FilterOptionRow
            key={opt.value}
            name={name}
            checked={value === opt.value}
            onSelect={() => onChange(opt.value)}
            label={opt.label}
            count={counted ? (opt.count ?? 0) : undefined}
          />
        ))}
      </div>
      {canCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-1.5 ml-6 text-xs font-semibold text-primary dark:text-accent hover:underline underline-offset-4 cursor-pointer"
        >
          {expanded ? "Ver menos" : `Ver todas (${visible.length})`}
        </button>
      )}
    </fieldset>
  );
}

function FilterOptionRow({
  name,
  checked,
  onSelect,
  label,
  count,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer group/opt">
      <input
        type="radio"
        name={`catalog-${name}`}
        checked={checked}
        onChange={onSelect}
        className="w-4 h-4 shrink-0 accent-primary dark:accent-accent"
      />
      <span
        className={`flex-1 min-w-0 text-sm leading-snug group-hover/opt:text-primary dark:group-hover/opt:text-accent transition-colors ${
          checked
            ? "font-semibold text-ink dark:text-white"
            : "text-ink dark:text-white"
        }`}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-muted tabular-nums">
          {numberFormat.format(count)}
        </span>
      )}
    </label>
  );
}

function SortSelect({
  value,
  onChange,
  compact,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
  compact?: boolean;
}) {
  return (
    <label className="flex items-center gap-2">
      {!compact && (
        <span className="text-xs text-muted font-semibold uppercase tracking-widest">
          Ordenar
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        aria-label="Ordenar productos"
        className="px-3 py-2 rounded-full text-sm text-ink bg-canvas border border-line focus:outline-none focus:border-primary dark:focus:border-accent transition-colors cursor-pointer"
      >
        <option value="relevancia">Relevancia</option>
        <option value="nombre">A — Z</option>
        <option value="nuevo">Nuevos primero</option>
        <option value="destacado">Destacados primero</option>
      </select>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Paginación                                                                  */
/* -------------------------------------------------------------------------- */

/** 1 … 4 5 6 … 620 — siempre primera, última y vecinas de la actual. */
function pageItems(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const start = Math.max(2, Math.min(page - 1, totalPages - 4));
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5));
  const items: (number | "gap")[] = [1];
  if (start > 2) items.push("gap");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);
  return items;
}

const pageButton =
  "min-w-10 h-10 px-2 rounded-full flex items-center justify-center text-sm font-semibold tabular-nums transition-[background-color,color,transform] duration-100 active:scale-[0.94] motion-reduce:transform-none cursor-pointer";

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <nav
      aria-label="Paginación"
      className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${pageButton} border border-line text-ink dark:text-white hover:bg-line/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100`}
        aria-label="Página anterior"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Números en tablet/escritorio; en móvil, "3 / 620". */}
      <ol className="hidden sm:flex items-center gap-1 list-none p-0 m-0">
        {pageItems(page, totalPages).map((item, i) =>
          item === "gap" ? (
            <li
              key={`gap-${i}`}
              aria-hidden
              className="w-8 text-center text-sm text-muted select-none"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Página ${item}`}
                className={`${pageButton} ${
                  item === page
                    ? "bg-primary text-white dark:bg-accent dark:text-primary"
                    : "text-ink dark:text-white hover:bg-line/60"
                }`}
              >
                {numberFormat.format(item)}
              </button>
            </li>
          ),
        )}
      </ol>
      <span className="sm:hidden text-sm font-semibold text-ink dark:text-white px-3 tabular-nums">
        {numberFormat.format(page)} / {numberFormat.format(totalPages)}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={`${pageButton} border border-line text-ink dark:text-white hover:bg-line/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100`}
        aria-label="Página siguiente"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Tarjetas                                                                    */
/* -------------------------------------------------------------------------- */

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted/60">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
          />
        </svg>
        <span className="sr-only">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      // Fotos de producto sobre blanco: contain + aire, sin recortar el equipo.
      className="w-full h-full object-contain p-5 group-hover:scale-[1.03] transition-transform duration-500 ease-out motion-reduce:transform-none"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

const ProductCard = memo(function ProductCard({
  product,
}: {
  product: CatalogProduct;
}) {
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.add(
      {
        slug: product.slug,
        nombre: product.nombre,
        marca: product.marca,
        imagen: product.imagen,
        categoria: product.categoria,
        sku: product.sku,
      },
      1,
    );
    toast.success(`Agregado: ${product.nombre}`, {
      action: {
        label: "Ver carrito",
        onClick: () => cartStore.openPanel(),
      },
    });
  };

  const meta = product.subcategoria ?? product.categoria;

  return (
    <a
      href={`/productos/${product.slug}`}
      className="group bento-card flex flex-col gap-4 p-5 hover:border-primary/30 transition-all active:scale-[0.99] motion-reduce:transform-none"
    >
      <div
        className={`aspect-4/3 rounded-xl overflow-hidden relative ${
          product.imagen ? "bg-white" : "bg-line/60"
        }`}
      >
        <ProductImage src={product.imagen} alt={product.nombre} />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.nuevo && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent text-primary">
              Nuevo
            </span>
          )}
          {!product.disponible && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-500/90 text-white">
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted truncate">
          {product.marca} · {meta}
        </p>
        <h3 className="text-base font-bold text-ink dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
          {product.nombre}
        </h3>
        <p className="text-sm text-muted line-clamp-2">{product.descripcion}</p>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="min-w-0 flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-accent">
              Ver detalle
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
            {product.sku && (
              <span className="text-[11px] text-muted tabular-nums truncate">
                SKU {product.sku}
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Agregar ${product.nombre} al carrito`}
            className="w-9 h-9 shrink-0 rounded-full bg-accent text-primary flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-100 cursor-pointer motion-reduce:transform-none"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>
    </a>
  );
});

function ProductCardSkeleton() {
  return (
    <div className="bento-card flex flex-col gap-4 p-5" aria-hidden>
      <div className="aspect-4/3 rounded-xl bg-line/60 animate-pulse motion-reduce:animate-none" />
      <div className="flex flex-col gap-2.5">
        <div className="h-2.5 w-1/3 rounded-full bg-line animate-pulse motion-reduce:animate-none" />
        <div className="h-4 w-4/5 rounded-full bg-line animate-pulse motion-reduce:animate-none" />
        <div className="h-3 w-full rounded-full bg-line/70 animate-pulse motion-reduce:animate-none" />
        <div className="h-3 w-2/3 rounded-full bg-line/70 animate-pulse motion-reduce:animate-none" />
      </div>
    </div>
  );
}
