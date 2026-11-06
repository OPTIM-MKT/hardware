import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  compareRelevance,
  toCatalogProduct,
} from "../../components/productos/catalog-data";

// Se genera una sola vez en el build y se sirve como archivo estático (CDN +
// compresión), en lugar de serializar ~9,300 productos dentro del HTML.
export const prerender = true;

export const GET: APIRoute = async () => {
  const productos = (await getCollection("productos"))
    .map(toCatalogProduct)
    .sort(compareRelevance);

  return new Response(JSON.stringify(productos), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
