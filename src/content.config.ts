import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const productos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/productos" }),
  schema: z.object({
    nombre: z.string(),
    marca: z.string(),
    marcaLogo: z.string().optional(),
    descripcion: z.string(),
    descripcionLarga: z.string().optional(),
    imagen: z.string().optional(),
    galeria: z.array(z.string()).default([]),
    categoria: z.string(),
    subcategoria: z.string().optional(),
    tags: z.array(z.string()).default([]),
    caracteristicas: z.array(z.string()).default([]),
    especificaciones: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .default([]),
    sku: z.string().optional(),
    disponible: z.boolean().default(true),
    destacado: z.boolean().default(false),
    nuevo: z.boolean().default(false),
  }),
});

const blogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blogs" }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    fecha: z.coerce.date(),
    autor: z.string().default("Hard-Ware"),
    portada: z.string().optional(),
    tags: z.array(z.string()).default([]),
    categoria: z.string().optional(),
    destacado: z.boolean().default(false),
    tiempoLectura: z.number().optional(),
  }),
});

export const collections = { productos, blogs };
