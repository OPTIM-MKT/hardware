import { useSyncExternalStore } from "react";
import { cartStore, totalUnidades, type CartItem } from "./cart-store";

export function useCartItems(): CartItem[] {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
}

export function useCartCount(): number {
  const items = useCartItems();
  return totalUnidades(items);
}

export function usePanelOpen(): boolean {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getPanelOpen,
    () => false
  );
}
