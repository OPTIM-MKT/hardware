"use client";

import { useState, type ReactNode } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

export const contactFormSchema = z.object({
  nombre: z.string().min(2, "Indica tu nombre"),
  empresa: z.string(),
  email: z.email("Correo inválido"),
  telefono: z.string(),
  producto: z.string().min(1, "Selecciona un producto"),
  tamanoPedido: z.string(),
  fechaEstimada: z.string(),
  comentarios: z.string(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ProductOption {
  value: string;
  label: string;
}

export interface ContactFormProps {
  productOptions?: ProductOption[];
  defaultProduct?: string;
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
  resolver?: Resolver<ContactFormData>;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  bare?: boolean;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

const SIZE_OPTIONS = ["10", "20", "50", "100+"] as const;

const DEFAULT_PRODUCTS: ProductOption[] = [
  { value: "terminales-moviles", label: "Terminales Móviles" },
  { value: "impresoras-etiquetas", label: "Impresoras de Etiquetas" },
  { value: "escaneres", label: "Escáneres / Lectores" },
  { value: "rfid", label: "RFID" },
  { value: "credencializacion", label: "Credencialización" },
  { value: "ribbons", label: "Ribbons / Consumibles" },
  { value: "rugged", label: "Equipos Rugged / Toughbook" },
  { value: "automatizacion", label: "Automatización Industrial" },
  { value: "cad", label: "Periféricos CAD / 3D" },
  { value: "audio", label: "Audio Profesional" },
  { value: "otro", label: "Otro" },
];

export default function ContactForm({
  productOptions = DEFAULT_PRODUCTS,
  defaultProduct = "",
  onSubmit,
  resolver,
  title = "Solicitar contacto",
  subtitle = "Cuéntanos qué necesitas. Te respondemos en menos de 24 h hábiles.",
  submitLabel = "Enviar solicitud",
  bare = false,
  className = "",
  header,
  footer,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: resolver ?? zodResolver(contactFormSchema),
    defaultValues: {
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      producto: defaultProduct,
      tamanoPedido: "",
      fechaEstimada: "",
      comentarios: "",
    },
  });

  const submitHandler: SubmitHandler<ContactFormData> = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    setSubmitted(true);
  };

  const wrapperClass = bare
    ? `flex flex-col gap-6 ${className}`
    : `bento-card ${className}`;

  if (submitted) {
    return (
      <div className={wrapperClass}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center gap-4"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{ background: "rgba(250,183,2,0.15)", color: "#fab702" }}
          >
            ✓
          </div>
          <h3 className="text-2xl font-bold text-ink">¡Mensaje enviado!</h3>
          <p className="text-muted text-sm max-w-xs leading-relaxed">
            Nuestro equipo te contactará en menos de{" "}
            <strong>24 horas hábiles</strong>.
          </p>
          <button
            type="button"
            onClick={() => {
              reset();
              setSubmitted(false);
            }}
            className="mt-2 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline hover:opacity-70 transition-opacity"
          >
            Enviar otra solicitud
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {header ?? (
        <div className="mb-8">
          <span
            className="inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full mb-3"
            style={{ background: "rgba(250,183,2,0.12)", color: "#fab702" }}
          >
            HardWare · Distribuidor autorizado en México
          </span>
          <h2 className="text-2xl font-bold text-ink mb-1">{title}</h2>
          <p className="text-muted text-sm">{subtitle}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(submitHandler)}
        noValidate
        className="space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="cf-nombre" label="Nombre *" error={errors.nombre?.message}>
            <input
              id="cf-nombre"
              type="text"
              placeholder="Juan Martínez"
              className={inputClass(!!errors.nombre)}
              {...register("nombre")}
            />
          </Field>
          <Field
            id="cf-empresa"
            label="Empresa"
            error={errors.empresa?.message}
          >
            <input
              id="cf-empresa"
              type="text"
              placeholder="Mi Empresa SA de CV"
              className={inputClass(!!errors.empresa)}
              {...register("empresa")}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="cf-email" label="Correo *" error={errors.email?.message}>
            <input
              id="cf-email"
              type="email"
              placeholder="tu@empresa.com"
              className={inputClass(!!errors.email)}
              {...register("email")}
            />
          </Field>
          <Field
            id="cf-telefono"
            label="Teléfono"
            error={errors.telefono?.message}
          >
            <input
              id="cf-telefono"
              type="tel"
              placeholder="818 000 0000"
              className={inputClass(!!errors.telefono)}
              {...register("telefono")}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            id="cf-producto"
            label="Producto de interés *"
            error={errors.producto?.message}
          >
            <select
              id="cf-producto"
              className={inputClass(!!errors.producto)}
              {...register("producto")}
            >
              <option value="">Seleccionar producto...</option>
              {productOptions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            id="cf-tamano"
            label="Tamaño de pedido"
            error={errors.tamanoPedido?.message}
          >
            <select
              id="cf-tamano"
              className={inputClass(!!errors.tamanoPedido)}
              {...register("tamanoPedido")}
            >
              <option value="">Seleccionar volumen...</option>
              {SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s} unidades
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          id="cf-fecha"
          label="Fecha estimada de compra"
          error={errors.fechaEstimada?.message}
        >
          <input
            id="cf-fecha"
            type="date"
            className={inputClass(!!errors.fechaEstimada)}
            {...register("fechaEstimada")}
          />
        </Field>

        <Field
          id="cf-comentarios"
          label="Comentarios adicionales"
          error={errors.comentarios?.message}
        >
          <textarea
            id="cf-comentarios"
            rows={4}
            placeholder="Describe tu proyecto, integración requerida, plazos u otros detalles relevantes..."
            className={`${inputClass(false)} resize-none`}
            {...register("comentarios")}
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center cursor-pointer justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm uppercase tracking-widest text-primary hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#fab702" }}
        >
          {isSubmitting ? "Enviando…" : submitLabel}
        </button>

        {footer ?? (
          <p className="text-center text-[11px] text-muted">
            HardWare es distribuidor autorizado en México. Al enviar aceptas la{" "}
            <a
              href="/privacidad"
              className="underline hover:text-primary dark:hover:text-accent"
            >
              política de privacidad
            </a>
            .
          </p>
        )}
      </form>
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-xl text-sm text-ink bg-canvas border transition-colors focus:outline-none placeholder:text-muted/60 ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-line focus:border-primary dark:focus:border-accent"
  }`;

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-muted"
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-500 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
