import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cartStore } from "./cart-store";
import { useCartItems, usePanelOpen } from "./use-cart";

export default function CartPanel() {
  const items = useCartItems();
  const open = usePanelOpen();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cartStore.closePanel();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const empty = items.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => cartStore.closePanel()}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            aria-hidden
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label="Carrito de cotización"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.35 }}
            data-surface="panel"
            className="fixed top-0 right-0 bottom-0 z-[70] w-full md:w-[420px] text-ink shadow-2xl flex flex-col"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-line">
              <div>
                <h2 className="text-lg font-bold text-ink">Tu carrito</h2>
                <p className="text-xs text-muted">
                  {items.length} producto{items.length === 1 ? "" : "s"} para cotizar
                </p>
              </div>
              <button
                type="button"
                onClick={() => cartStore.closePanel()}
                aria-label="Cerrar carrito"
                className="w-9 h-9 rounded-full hover:bg-line/60 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {empty ? (
                <EmptyState />
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((item) => (
                    <li key={item.slug} className="p-5 flex gap-4">
                      <a
                        href={`/productos/${item.slug}`}
                        onClick={() => cartStore.closePanel()}
                        className="block w-20 h-20 rounded-lg overflow-hidden bg-line shrink-0"
                      >
                        {item.imagen ? (
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </a>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className="text-[10px] uppercase tracking-widest text-muted font-semibold">
                          {item.marca}
                        </p>
                        <a
                          href={`/productos/${item.slug}`}
                          onClick={() => cartStore.closePanel()}
                          className="text-sm font-semibold text-ink hover:text-primary line-clamp-2"
                        >
                          {item.nombre}
                        </a>
                        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                          <QuantityStepper
                            value={item.cantidad}
                            onChange={(v) => cartStore.setCantidad(item.slug, v)}
                          />
                          <button
                            type="button"
                            onClick={() => cartStore.remove(item.slug)}
                            className="text-xs text-muted hover:text-red-500 transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-line p-5 flex flex-col gap-3">
              <a
                href="/contact?mode=productos"
                onClick={() => cartStore.closePanel()}
                aria-disabled={empty}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-300 ${
                  empty
                    ? "bg-line text-muted pointer-events-none"
                    : "bg-accent text-primary hover:-translate-y-0.5 hover:shadow-lg"
                }`}
              >
                Cotizar ahora
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
              {!empty && (
                <button
                  type="button"
                  onClick={() => cartStore.clear()}
                  className="text-xs text-muted hover:text-ink underline cursor-pointer"
                >
                  Vaciar carrito
                </button>
              )}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16 gap-3 h-full">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "rgba(250,183,2,0.12)", color: "#fab702" }}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218a.75.75 0 0 0 .728-.568l1.95-7.781a.75.75 0 0 0-.728-.932H5.106M7.5 14.25 5.106 5.969"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-ink">Tu carrito está vacío</p>
      <p className="text-xs text-muted max-w-[220px] leading-relaxed">
        Agrega productos desde el catálogo para solicitar tu cotización personalizada.
      </p>
      <a
        href="/productos"
        onClick={() => cartStore.closePanel()}
        className="mt-2 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline hover:opacity-70 transition-opacity"
      >
        Ver productos
      </a>
    </div>
  );
}

function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="inline-flex items-center border border-line rounded-full overflow-hidden">
      <button
        type="button"
        aria-label="Reducir cantidad"
        onClick={() => onChange(value - 1)}
        className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
      >
        −
      </button>
      <span className="text-xs font-semibold text-ink min-w-6 text-center tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
