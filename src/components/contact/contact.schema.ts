import { z } from "zod";

export const PRESUPUESTO_OPTIONS = [
  { value: "under_50k", label: "Menos de $50,000 MXN" },
  { value: "50k_150k", label: "$50,000 – $150,000 MXN" },
  { value: "150k_500k", label: "$150,000 – $500,000 MXN" },
  { value: "500k_1m", label: "$500,000 – $1,000,000 MXN" },
  { value: "1m_plus", label: "Más de $1,000,000 MXN" },
  { value: "por_definir", label: "Por definir" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "Lo antes posible" },
  { value: "1_3m", label: "1 – 3 meses" },
  { value: "3_6m", label: "3 – 6 meses" },
  { value: "6m_plus", label: "Más de 6 meses" },
  { value: "exploratorio", label: "Exploratorio" },
] as const;

export const cartItemSchema = z.object({
  slug: z.string(),
  nombre: z.string(),
  marca: z.string(),
  categoria: z.string(),
  cantidad: z.coerce.number().int().min(1),
  sku: z.string().optional(),
});

export type CartItemPayload = z.infer<typeof cartItemSchema>;

const baseSchema = z.object({
  nombre: z.string().min(2, "Indica tu nombre"),
  empresa: z.string().optional().or(z.literal("")),
  email: z.string().email("Correo inválido"),
  telefono: z.string().min(7, "Indica un teléfono válido"),
  mensaje: z.string().optional().or(z.literal("")),
});

export const productosModeSchema = baseSchema.extend({
  modo: z.literal("productos"),
  items: z.array(cartItemSchema).min(1, "Agrega al menos un producto al carrito"),
});

export const proyectoModeSchema = baseSchema.extend({
  modo: z.literal("proyecto"),
  descripcionProyecto: z
    .string()
    .min(20, "Describe brevemente tu proyecto (mín. 20 caracteres)"),
  presupuesto: z.enum(
    PRESUPUESTO_OPTIONS.map((o) => o.value) as [string, ...string[]],
    { message: "Selecciona un rango de presupuesto" }
  ),
  timeline: z.enum(
    TIMELINE_OPTIONS.map((o) => o.value) as [string, ...string[]],
    { message: "Selecciona un horizonte de tiempo" }
  ),
});

export const contactSchema = z.discriminatedUnion("modo", [
  productosModeSchema,
  proyectoModeSchema,
]);

export type ContactFormData = z.infer<typeof contactSchema>;

export function getLabelByValue<
  T extends readonly { value: string; label: string }[],
>(options: T, value?: string): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}
