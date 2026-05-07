import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const productoEnMarca = z.object({
  nombre: z.string(),
  imagen: z.string(),
  slug: z.string().optional(),
  descripcion: z.string().optional(),
});

const marcas = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/marcas" }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    logo: z.string().optional(),
    distribuidorAutorizadoMX: z.boolean().default(false),
    sitioWeb: z.string().url().optional(),
    categorias: z.array(z.string()).default([]),
    productos: z.array(productoEnMarca).default([]),
  }),
});

const taxonomia = z.object({
  nombre: z.string(),
  titulo: z.string().optional(),
  descripcion: z.string(),
  imagen: z.string().optional(),
  icono: z.string().optional(),
  retosComunes: z.array(z.string()).default([]),
  solucionesRecomendadas: z.array(z.string()).default([]),
  productosRelevantes: z.array(z.string()).default([]),
  marcasRelacionadas: z.array(z.string()).default([]),
});

const industrias = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/industrias" }),
  schema: taxonomia,
});

const soluciones = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/soluciones" }),
  schema: taxonomia.extend({
    tagline: z.string().optional(),
    industrias: z.array(z.string()).default([]),
    beneficios: z.array(z.string()).default([]),
    ctaLabel: z.string().default("Cotizar Solución"),
    ctaHref: z.string().default("/contact"),
    destacada: z.boolean().default(false),
  }),
});

const productos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/productos" }),
  schema: z.object({
    nombre: z.string(),
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
