// Lightweight global cart store with localStorage persistence.
// Vanilla pub-sub so any island (CartButton, CartPanel, ContactForm) can subscribe
// from React via useSyncExternalStore without needing a shared provider tree.

export interface CartItem {
  slug: string;
  nombre: string;
  marca: string;
  imagen?: string;
  categoria: string;
  sku?: string;
  cantidad: number;
}

const STORAGE_KEY = "hw-cart-v1";

type Listener = () => void;

const listeners = new Set<Listener>();
let items: CartItem[] = [];
let panelOpen = false;
let hydrated = false;

function readFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) => i && typeof i.slug === "string" && typeof i.cantidad === "number"
    );
  } catch {
    return [];
  }
}

function writeToStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
}

function emit() {
  for (const fn of listeners) fn();
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  items = readFromStorage();
  hydrated = true;
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      items = readFromStorage();
      emit();
    }
  });
}

export const cartStore = {
  subscribe(listener: Listener) {
    ensureHydrated();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): CartItem[] {
    ensureHydrated();
    return items;
  },

  getServerSnapshot(): CartItem[] {
    return [];
  },

  getPanelOpen(): boolean {
    return panelOpen;
  },

  add(item: Omit<CartItem, "cantidad">, cantidad = 1) {
    ensureHydrated();
    const existing = items.find((i) => i.slug === item.slug);
    if (existing) {
      items = items.map((i) =>
        i.slug === item.slug ? { ...i, cantidad: i.cantidad + cantidad } : i
      );
    } else {
      items = [...items, { ...item, cantidad }];
    }
    writeToStorage();
    emit();
  },

  remove(slug: string) {
    ensureHydrated();
    items = items.filter((i) => i.slug !== slug);
    writeToStorage();
    emit();
  },

  setCantidad(slug: string, cantidad: number) {
    ensureHydrated();
    if (cantidad <= 0) {
      this.remove(slug);
      return;
    }
    items = items.map((i) => (i.slug === slug ? { ...i, cantidad } : i));
    writeToStorage();
    emit();
  },

  clear() {
    ensureHydrated();
    items = [];
    writeToStorage();
    emit();
  },

  openPanel() {
    panelOpen = true;
    emit();
  },

  closePanel() {
    panelOpen = false;
    emit();
  },

  togglePanel() {
    panelOpen = !panelOpen;
    emit();
  },
};

export function totalUnidades(arr: CartItem[]): number {
  return arr.reduce((sum, i) => sum + i.cantidad, 0);
}
