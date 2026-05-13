import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { cartStore } from "../cart/cart-store";

export interface CatalogProduct {
  slug: string;
  nombre: string;
  marca: string;
  categoria: string;
  descripcion: string;
  imagen?: string;
  disponible: boolean;
  destacado: boolean;
  nuevo: boolean;
  sku?: string;
  tags: string[];
}

interface Props {
  products: CatalogProduct[];
}

type SortKey = "relevancia" | "nombre" | "nuevo" | "destacado";

export default function ProductCatalog({ products }: Props) {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState<string>("all");
  const [marca, setMarca] = useState<string>("all");
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categorias = useMemo(
    () => Array.from(new Set(products.map((p) => p.categoria))).sort(),
    [products]
  );
  const marcas = useMemo(
    () => Array.from(new Set(products.map((p) => p.marca))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (categoria !== "all" && p.categoria !== categoria) return false;
      if (marca !== "all" && p.marca !== marca) return false;
      if (soloDisponibles && !p.disponible) return false;
      if (!q) return true;
      const haystack = [
        p.nombre,
        p.marca,
        p.categoria,
        p.descripcion,
        p.sku ?? "",
        ...p.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    switch (sort) {
      case "nombre":
        list = [...list].sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "nuevo":
        list = [...list].sort((a, b) => Number(b.nuevo) - Number(a.nuevo));
        break;
      case "destacado":
        list = [...list].sort((a, b) => Number(b.destacado) - Number(a.destacado));
        break;
      default:
        list = [...list].sort(
          (a, b) =>
            Number(b.destacado) - Number(a.destacado) ||
            Number(b.nuevo) - Number(a.nuevo) ||
            a.nombre.localeCompare(b.nombre)
        );
    }

    return list;
  }, [products, query, categoria, marca, soloDisponibles, sort]);

  const hasFilters =
    query !== "" || categoria !== "all" || marca !== "all" || soloDisponibles;

  const resetFilters = () => {
    setQuery("");
    setCategoria("all");
    setMarca("all");
    setSoloDisponibles(false);
    setSort("relevancia");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
      {/* Mobile filters trigger */}
      <div className="md:hidden flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-line text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M5.25 12h13.5M9.75 19.5h4.5" />
          </svg>
          Filtros
          {hasFilters && (
            <span className="w-2 h-2 rounded-full bg-accent" aria-hidden />
          )}
        </button>
        <SortSelect value={sort} onChange={setSort} compact />
      </div>

      {/* Desktop filters */}
      <aside className="hidden md:block">
        <FiltersPanel
          query={query}
          onQuery={setQuery}
          categoria={categoria}
          onCategoria={setCategoria}
          categorias={categorias}
          marca={marca}
          onMarca={setMarca}
          marcas={marcas}
          soloDisponibles={soloDisponibles}
          onSoloDisponibles={setSoloDisponibles}
          onReset={resetFilters}
          hasFilters={hasFilters}
        />
      </aside>

      {/* Mobile drawer */}
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              data-surface="panel"
              className="fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm p-6 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-ink">Filtros</h3>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Cerrar"
                  className="w-9 h-9 rounded-full hover:bg-line/60 flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FiltersPanel
                query={query}
                onQuery={setQuery}
                categoria={categoria}
                onCategoria={setCategoria}
                categorias={categorias}
                marca={marca}
                onMarca={setMarca}
                marcas={marcas}
                soloDisponibles={soloDisponibles}
                onSoloDisponibles={setSoloDisponibles}
                onReset={resetFilters}
                hasFilters={hasFilters}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section>
        <div className="hidden md:flex items-center justify-between mb-6 gap-4">
          <p className="text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
          </p>
          <SortSelect value={sort} onChange={setSort} />
        </div>

        {filtered.length === 0 ? (
          <div className="bento-card flex flex-col items-center text-center py-16 gap-3">
            <p className="text-base font-semibold text-ink">Sin resultados</p>
            <p className="text-sm text-muted max-w-sm">
              No encontramos productos con esos criterios. Ajusta los filtros o busca otra palabra.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FiltersPanel({
  query,
  onQuery,
  categoria,
  onCategoria,
  categorias,
  marca,
  onMarca,
  marcas,
  soloDisponibles,
  onSoloDisponibles,
  onReset,
  hasFilters,
}: {
  query: string;
  onQuery: (v: string) => void;
  categoria: string;
  onCategoria: (v: string) => void;
  categorias: string[];
  marca: string;
  onMarca: (v: string) => void;
  marcas: string[];
  soloDisponibles: boolean;
  onSoloDisponibles: (v: boolean) => void;
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2 block">
          Buscar
        </label>
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar productos…"
            className="w-full pl-10 pr-4 py-3 rounded-full text-sm text-ink bg-canvas border border-line focus:outline-none focus:border-primary dark:focus:border-accent transition-colors"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.34-4.34M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
          </svg>
        </div>
      </div>

      <FilterGroup
        label="Categoría"
        value={categoria}
        onChange={onCategoria}
        options={categorias}
      />
      <FilterGroup
        label="Marca"
        value={marca}
        onChange={onMarca}
        options={marcas}
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={soloDisponibles}
          onChange={(e) => onSoloDisponibles(e.target.checked)}
          className="w-4 h-4 rounded border-line accent-primary"
        />
        <span className="text-sm text-ink">Solo disponibles</span>
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline self-start cursor-pointer"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <fieldset>
      <legend className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">
        {label}
      </legend>
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value === "all"}
            onChange={() => onChange("all")}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-ink">Todas</span>
        </label>
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-ink">{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
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

function ProductCard({ product }: { product: CatalogProduct }) {
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
      1
    );
    toast.success(`Agregado: ${product.nombre}`, {
      action: {
        label: "Ver carrito",
        onClick: () => cartStore.openPanel(),
      },
    });
  };

  return (
    <a
      href={`/productos/${product.slug}`}
      className="group bento-card flex flex-col gap-4 p-5 hover:border-primary/30 transition-all"
    >
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-line relative">
        {product.imagen ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full" />
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
          {product.marca} · {product.categoria}
        </p>
        <h3 className="text-base font-bold text-ink line-clamp-2 group-hover:text-primary transition-colors">
          {product.nombre}
        </h3>
        <p className="text-sm text-muted line-clamp-2">{product.descripcion}</p>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-accent">
            Ver detalle
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Agregar ${product.nombre} al carrito`}
            className="w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </a>
  );
}
