import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// ────────────────────────────────────────────────
// Marcas
// ────────────────────────────────────────────────
const marcas = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/marcas" }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    logo: z.string().optional(),
    distribuidorAutorizadoMX: z.boolean().default(false),
    sitioWeb: z.string().url().optional(),
    categorias: z.array(z.string()).default([]),
  }),
});

// ────────────────────────────────────────────────
// Industrias
// ────────────────────────────────────────────────
const industrias = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/industrias" }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string().optional(),
    icono: z.string().optional(),
  }),
});

// ────────────────────────────────────────────────
// Soluciones
// ────────────────────────────────────────────────
const soluciones = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/soluciones" }),
  schema: z.object({
    nombre: z.string(),
    tagline: z.string(),
    descripcion: z.string(),
    imagen: z.string().optional(),
    // ids de industrias como strings (se resuelven manualmente en las páginas)
    industrias: z.array(z.string()).optional(),
    beneficios: z.array(z.string()).default([]),
    ctaLabel: z.string().default("Cotizar Solución"),
    ctaHref: z.string().default("/contact"),
    destacada: z.boolean().default(false),
  }),
});

// ────────────────────────────────────────────────
// Productos
// ────────────────────────────────────────────────
const productos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/productos" }),
  schema: z.object({
    nombre: z.string(),
    // id de marca como string (se resuelve manualmente en las páginas)
    marca: z.string(),
    descripcion: z.string(),
    descripcionLarga: z.string().optional(),
    imagen: z.string().optional(),
    industrias: z.array(z.string()).default([]),
    solucionRelacionada: z.string().optional(),
    complementos: z.array(z.string()).default([]),
    caracteristicas: z.array(z.string()).default([]),
    precio: z
      .object({
        desde: z.number().optional(),
        moneda: z.string().default("MXN"),
        cotizar: z.boolean().default(true),
      })
      .optional(),
    sku: z.string().optional(),
    disponible: z.boolean().default(true),
    destacado: z.boolean().default(false),
    categoria: z.string().optional(),
  }),
});

export const collections = { marcas, industrias, soluciones, productos };
