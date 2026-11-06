import type { CollectionEntry } from "astro:content";
import {
  isExtendedCatalog,
  resolveSectionId,
} from "../../constants/product-sections";
import type { CatalogProduct } from "./ProductCatalog";

/** Productos por página en /productos. */
export const CATALOG_PAGE_SIZE = 15;

/** URL del JSON estático con el catálogo completo (ver pages/productos/catalogo.json.ts). */
export const CATALOG_JSON_URL = "/productos/catalogo.json";

const RESUMEN_MAX = 160;

function resumen(texto: string) {
  const limpio = texto.replace(/\s+/g, " ").trim();
  return limpio.length > RESUMEN_MAX
    ? `${limpio.slice(0, RESUMEN_MAX - 1).trimEnd()}…`
    : limpio;
}

export function toCatalogProduct({
  id,
  data,
}: CollectionEntry<"productos">): CatalogProduct {
  const extendido = isExtendedCatalog(id);
  return {
    slug: id,
    nombre: data.nombre,
    marca: data.marca,
    categoria: data.categoria,
    subcategoria: data.subcategoria,
    seccion: resolveSectionId(data),
    // En el catálogo extendido `descripcion` repite el nombre + número de
    // parte; la descripción larga es la que aporta información.
    descripcion: resumen(
      extendido ? (data.descripcionLarga ?? data.descripcion) : data.descripcion,
    ),
    imagen: data.imagen,
    disponible: data.disponible,
    destacado: data.destacado,
    nuevo: data.nuevo,
    sku: data.sku,
    tags: data.tags,
    extendido,
  };
}

/**
 * Orden "Relevancia": destacados y nuevos, luego la selección curada de
 * Hard-Ware, lo disponible y lo que tiene foto; al final, alfabético.
 */
export function compareRelevance(a: CatalogProduct, b: CatalogProduct) {
  return (
    Number(b.destacado) - Number(a.destacado) ||
    Number(b.nuevo) - Number(a.nuevo) ||
    Number(a.extendido) - Number(b.extendido) ||
    Number(b.disponible) - Number(a.disponible) ||
    Number(Boolean(b.imagen)) - Number(Boolean(a.imagen)) ||
    a.nombre.localeCompare(b.nombre, "es")
  );
}
