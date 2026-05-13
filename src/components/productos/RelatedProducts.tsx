import { cartStore } from "../cart/cart-store";
import { toast } from "sonner";

export interface RelatedProduct {
  slug: string;
  nombre: string;
  marca: string;
  categoria: string;
  descripcion: string;
  imagen?: string;
  sku?: string;
}

interface Props {
  products: RelatedProduct[];
  title?: string;
}

export default function RelatedProducts({
  products,
  title = "Productos recomendados",
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-950">
      <div className="container-lg">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">
              También te puede interesar
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">{title}</h2>
          </div>
          <a
            href="/productos"
            className="hidden md:inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent hover:gap-2 transition-all"
          >
            Ver todos
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <RelatedCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedCard({ product }: { product: RelatedProduct }) {
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
      action: { label: "Ver carrito", onClick: () => cartStore.openPanel() },
    });
  };

  return (
    <a
      href={`/productos/${product.slug}`}
      className="group bento-card flex flex-col gap-4 p-4 hover:border-primary/30 transition-all"
    >
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-line">
        {product.imagen ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
          {product.marca}
        </p>
        <h3 className="text-sm font-bold text-ink line-clamp-2 group-hover:text-primary transition-colors">
          {product.nombre}
        </h3>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-widest border border-line text-ink hover:border-primary hover:text-primary transition-colors cursor-pointer"
      >
        Agregar
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </a>
  );
}
