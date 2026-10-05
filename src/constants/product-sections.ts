export const PRODUCT_SECTION_IDS = [
  "impresion",
  "captura-de-datos",
  "computo-movil",
  "consumibles",
  "automatizacion",
  "diseno-cad",
  "audio",
] as const;

export type ProductSectionId = (typeof PRODUCT_SECTION_IDS)[number];

export interface ProductSection {
  id: ProductSectionId;
  title: string;
  description: string;
  /** Categorías (campo `categoria` del producto) que pertenecen a la sección. */
  categorias: string[];
}

export const PRODUCT_SECTIONS: ProductSection[] = [
  {
    id: "impresion",
    title: "Impresión",
    description:
      "Impresoras de etiquetas industriales, de escritorio y de punto de venta.",
    categorias: ["Impresoras", "Impresoras Industriales", "Punto de Venta"],
  },
  {
    id: "captura-de-datos",
    title: "Captura de datos",
    description: "Escáneres de códigos de barras para piso, almacén y mostrador.",
    categorias: ["Escáneres", "Escáneres Industriales"],
  },
  {
    id: "computo-movil",
    title: "Cómputo móvil",
    description: "Terminales, tablets rugged y periféricos de uso rudo.",
    categorias: [
      "Terminales Móviles",
      "Cómputo Móvil",
      "Teclados Industriales",
      "Accesorios Industriales",
    ],
  },
  {
    id: "consumibles",
    title: "Consumibles",
    description: "Ribbons, etiquetas, brazaletes y refacciones originales.",
    categorias: ["Consumibles", "Refacciones", "Salud"],
  },
  {
    id: "automatizacion",
    title: "Automatización",
    description: "HMI, relevadores y control para tu línea de producción.",
    categorias: ["Automatización", "HMI"],
  },
  {
    id: "diseno-cad",
    title: "Diseño y CAD",
    description: "Ratones CAD y navegación 3D para ingeniería y diseño.",
    categorias: ["Ratones CAD", "Navegación 3D", "Kits", "Accesorios"],
  },
  {
    id: "audio",
    title: "Audio y colaboración",
    description: "Auriculares y altavoces profesionales para tu equipo.",
    categorias: ["Audio", "Audio Profesional", "Colaboración"],
  },
];

/** Secciones que aparecen como pestañas en "Lo más vendido en…" del home. */
export const BEST_SELLER_SECTION_IDS: ProductSectionId[] = [
  "impresion",
  "captura-de-datos",
  "computo-movil",
];

/** Nombre del query param que el catálogo lee para filtrar por sección. */
export const SECTION_QUERY_PARAM = "seccion";

export const sectionHref = (id: ProductSectionId) =>
  `/productos?${SECTION_QUERY_PARAM}=${id}`;

/**
 * Sección de un producto: el campo `seccion` del frontmatter manda;
 * si no existe, se deriva de su `categoria`.
 */
export function resolveSectionId(product: {
  categoria: string;
  seccion?: ProductSectionId;
}): ProductSectionId | undefined {
  return (
    product.seccion ??
    PRODUCT_SECTIONS.find((s) => s.categorias.includes(product.categoria))?.id
  );
}
