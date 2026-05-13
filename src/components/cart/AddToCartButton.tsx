import { useState } from "react";
import { toast } from "sonner";
import { cartStore, type CartItem } from "./cart-store";

interface Props {
  product: Omit<CartItem, "cantidad">;
  variant?: "primary" | "ghost";
  className?: string;
  showQuantity?: boolean;
  openPanelOnAdd?: boolean;
}

export default function AddToCartButton({
  product,
  variant = "primary",
  className = "",
  showQuantity = false,
  openPanelOnAdd = true,
}: Props) {
  const [cantidad, setCantidad] = useState(1);

  const handleAdd = () => {
    cartStore.add(product, cantidad);
    toast.success(`Agregado: ${product.nombre}`, {
      description: `Cantidad: ${cantidad}`,
      action: {
        label: "Ver carrito",
        onClick: () => cartStore.openPanel(),
      },
    });
    if (openPanelOnAdd) cartStore.openPanel();
  };

  const styles =
    variant === "primary"
      ? "bg-accent text-primary dark:text-accent hover:-translate-y-0.5 hover:shadow-lg"
      : "border border-line text-ink hover:border-primary hover:text-primary";

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {showQuantity && (
        <div className="inline-flex items-center border border-line rounded-full overflow-hidden self-start">
          <button
            type="button"
            aria-label="Reducir cantidad"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
          >
            −
          </button>
          <span className="text-sm font-semibold text-primary dark:text-accent min-w-8 text-center tabular-nums">
            {cantidad}
          </span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            onClick={() => setCantidad((c) => c + 1)}
            className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
          >
            +
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer ${styles}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218a.75.75 0 0 0 .728-.568l1.95-7.781a.75.75 0 0 0-.728-.932H5.106M7.5 14.25 5.106 5.969"
          />
        </svg>
        Agregar al carrito
      </button>
    </div>
  );
}
