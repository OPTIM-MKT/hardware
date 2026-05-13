import { cartStore } from "./cart-store";
import { useCartCount } from "./use-cart";

export default function CartButton() {
  const count = useCartCount();

  return (
    <button
      type="button"
      onClick={() => cartStore.openPanel()}
      aria-label={`Abrir carrito${count ? ` (${count} artículos)` : ""}`}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-accent dark:text-white hover:bg-white/10 transition-colors cursor-pointer"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218a.75.75 0 0 0 .728-.568l1.95-7.781a.75.75 0 0 0-.728-.932H5.106M7.5 14.25 5.106 5.969M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-accent text-primary text-[10px] font-bold flex items-center justify-center leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
