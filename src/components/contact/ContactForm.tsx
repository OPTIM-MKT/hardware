import { useEffect, useState, type ReactNode } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { actions } from "astro:actions";
import {
  contactSchema,
  PRESUPUESTO_OPTIONS,
  TIMELINE_OPTIONS,
  type ContactFormData,
} from "./contact.schema";
import { cartStore } from "../cart/cart-store";
import { useCartItems } from "../cart/use-cart";

interface ContactFormProps {
  initialMode?: "productos" | "proyecto";
}

export default function ContactForm({
  initialMode = "proyecto",
}: ContactFormProps) {
  const cartItems = useCartItems();
  const [mode, setMode] = useState<"productos" | "proyecto">(initialMode);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const queryMode = params.get("mode");
    if (queryMode === "productos" || queryMode === "proyecto") {
      setMode(queryMode);
    } else if (cartItems.length > 0) {
      setMode("productos");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      modo: initialMode,
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      mensaje: "",
      descripcionProyecto: "",
      presupuesto: "",
      timeline: "",
    } as unknown as ContactFormData,
  });

  // Keep RHF state in sync with the mode toggle. A hidden input bound to
  // `register("modo")` doesn't fire onChange when its `value` prop mutates,
  // so RHF would keep the default and the discriminated-union validation
  // would silently fail.
  useEffect(() => {
    setValue("modo", mode as ContactFormData["modo"], {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [mode, setValue]);

  // Mirror the cart into form state so zod's `items.min(1)` validation passes
  // (and so we always submit the latest cart, not a stale closure).
  useEffect(() => {
    if (mode === "productos") {
      setValue("items" as any, cartItems as any, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [mode, cartItems, setValue]);

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    const payload: ContactFormData =
      data.modo === "productos"
        ? { ...data, items: cartItems }
        : data;

    try {
      const { error } = await actions.send(payload);

      if (error) {
        console.error("[ContactForm] action returned error:", error);
        toast.error("No pudimos enviar tu solicitud", {
          description: error.message ?? "Inténtalo de nuevo en unos minutos.",
        });
        return;
      }

      toast.success("Solicitud enviada", {
        description: "Te contactaremos en menos de 24 h hábiles.",
      });
      if (payload.modo === "productos") cartStore.clear();
      setSubmitted(true);
    } catch (err) {
      console.error("[ContactForm] submit threw:", err);
      toast.error("Error inesperado", {
        description:
          err instanceof Error
            ? err.message
            : "Revisa tu conexión e inténtalo otra vez.",
      });
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    console.warn("[ContactForm] validation errors:", formErrors);
    const firstMsg =
      Object.values(formErrors)[0]?.message ??
      "Revisa los campos marcados en rojo.";
    toast.error("Faltan campos por completar", {
      description: String(firstMsg),
    });
  };

  if (submitted) {
    return (
      <div className="bento-card">
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
          <h3 className="text-2xl font-bold text-black dark:text-white">¡Mensaje enviado!</h3>
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
            className="mt-2 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline hover:opacity-70 transition-opacity cursor-pointer"
          >
            Enviar otra solicitud
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="contact-form" className="bento-card scroll-mt-32">
      <header className="mb-8">
        <span
          className="inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full mb-3"
          style={{ background: "rgba(250,183,2,0.12)", color: "#fab702" }}
        >
          Hard-Ware · Distribuidor autorizado en México
        </span>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-1">Solicita tu cotización</h2>
        <p className="text-muted text-sm">
          Te respondemos en menos de 24 h hábiles.
        </p>
      </header>

      <ModeSwitch mode={mode} onChange={setMode} />

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="space-y-5 mt-8"
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
          <Field id="cf-empresa" label="Empresa" error={errors.empresa?.message}>
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
          <Field id="cf-telefono" label="Teléfono *" error={errors.telefono?.message}>
            <input
              id="cf-telefono"
              type="tel"
              placeholder="818 000 0000"
              className={inputClass(!!errors.telefono)}
              {...register("telefono")}
            />
          </Field>
        </div>

        {mode === "productos" ? (
          <ProductsSection items={cartItems} />
        ) : (
          <ProyectoSection register={register} errors={errors} />
        )}

        <Field
          id="cf-mensaje"
          label={mode === "productos" ? "Comentarios adicionales" : "Detalles adicionales"}
          error={errors.mensaje?.message}
        >
          <textarea
            id="cf-mensaje"
            rows={4}
            placeholder={
              mode === "productos"
                ? "Volumen estimado, requisitos de integración, plazos..."
                : "Cualquier detalle adicional relevante para tu proyecto..."
            }
            className={`${inputClass(false)} resize-none`}
            {...register("mensaje")}
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting || (mode === "productos" && cartItems.length === 0)}
          className="w-full flex items-center cursor-pointer justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm uppercase tracking-widest bg-accent text-primary hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isSubmitting
            ? "Enviando…"
            : mode === "productos"
            ? "Solicitar cotización"
            : "Enviar solicitud"}
        </button>

        <p className="text-center text-[11px] text-muted">
          Hard-Ware es distribuidor autorizado en México. Al enviar aceptas la{" "}
          <a
            href="/privacidad"
            className="underline hover:text-primary dark:hover:text-accent"
          >
            política de privacidad
          </a>
          .
        </p>
      </form>
    </div>
  );
}

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: "productos" | "proyecto";
  onChange: (m: "productos" | "proyecto") => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Tipo de cotización"
      className="grid grid-cols-2 gap-2 p-1 rounded-full border border-line bg-canvas"
    >
      <ModeOption
        active={mode === "productos"}
        onClick={() => onChange("productos")}
        label="Por productos"
      />
      <ModeOption
        active={mode === "proyecto"}
        onClick={() => onChange("proyecto")}
        label="Por proyecto"
      />
    </div>
  );
}

function ModeOption({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
        active
          ? "bg-primary text-white shadow"
          : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function ProductsSection({
  items,
}: {
  items: ReturnType<typeof useCartItems>;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line p-6 text-center bg-canvas">
        <p className="text-sm font-semibold text-ink mb-1">
          Aún no tienes productos en tu carrito
        </p>
        <p className="text-xs text-muted mb-3">
          Agrégalos desde el catálogo para cotizarlos juntos.
        </p>
        <a
          href="/productos"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline cursor-pointer"
        >
          Ver productos
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-canvas">
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Productos en tu cotización ({items.length})
        </p>
        <button
          type="button"
          onClick={() => cartStore.openPanel()}
          className="text-xs font-semibold text-primary dark:text-accent hover:underline cursor-pointer"
        >
          Editar
        </button>
      </div>
      <ul className="divide-y divide-line">
        {items.map((it) => (
          <li key={it.slug} className="flex items-center gap-3 px-4 py-3">
            {it.imagen ? (
              <img
                src={it.imagen}
                alt={it.nombre}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-line" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted font-semibold">
                {it.marca}
              </p>
              <p className="text-sm font-semibold text-ink line-clamp-1">
                {it.nombre}
              </p>
            </div>
            <span className="text-xs font-bold text-ink tabular-nums">
              ×{it.cantidad}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProyectoSection({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<ContactFormData>>["register"];
  errors: ReturnType<typeof useForm<ContactFormData>>["formState"]["errors"];
}) {
  return (
    <div className="space-y-5">
      <Field
        id="cf-desc"
        label="Descripción del proyecto *"
        error={(errors as any).descripcionProyecto?.message}
      >
        <textarea
          id="cf-desc"
          rows={4}
          placeholder="Cuéntanos qué quieres lograr: industria, alcance, integraciones, equipos involucrados…"
          className={`${inputClass(!!(errors as any).descripcionProyecto)} resize-none`}
          {...register("descripcionProyecto" as any)}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          id="cf-presupuesto"
          label="Presupuesto estimado *"
          error={(errors as any).presupuesto?.message}
        >
          <select
            id="cf-presupuesto"
            className={inputClass(!!(errors as any).presupuesto)}
            {...register("presupuesto" as any)}
          >
            <option value="">Selecciona un rango…</option>
            {PRESUPUESTO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="cf-timeline"
          label="Horizonte de tiempo *"
          error={(errors as any).timeline?.message}
        >
          <select
            id="cf-timeline"
            className={inputClass(!!(errors as any).timeline)}
            {...register("timeline" as any)}
          >
            <option value="">Selecciona…</option>
            {TIMELINE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-xl text-sm text-ink bg-canvas border transition-colors focus:outline-none placeholder:text-muted/60 ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-line focus:border-primary dark:focus:border-accent"
  }`;

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
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
