import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ──────────────────────────────────────────
interface Props {
  initialProduct?: string;
  initialCategory?: string;
  formId?: string;
}

interface FormData {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  interes: string;
  categoria: string;
  cantidad: string;
  mensaje: string;
}

const initialForm = (product?: string, category?: string): FormData => ({
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  interes: product ?? "",
  categoria: category ?? "",
  cantidad: "",
  mensaje: "",
});

const CATEGORIAS = [
  "Terminales Móviles",
  "Impresoras de Etiquetas",
  "Escáneres / Lectores",
  "RFID",
  "Credencialización",
  "Reparación / Mantenimiento",
  "Software",
  "Otro",
];

// ─── Field Validation ───────────────────────────────
function validate(form: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (!form.nombre.trim()) errors.nombre = "Tu nombre es requerido";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Correo electrónico inválido";
  if (!form.interes.trim()) errors.interes = "Indica el producto o servicio de interés";
  return errors;
}

// ─── Component ──────────────────────────────────────
export default function QuoteForm({ initialProduct, initialCategory, formId = "quote-form" }: Props) {
  const [form, setForm] = useState<FormData>(initialForm(initialProduct, initialCategory));
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setStatus("loading");
    // Simulate network call (replace with your Astro action / API route)
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  };

  if (status === "success") {
    return (
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
        <h3 className="text-2xl font-bold text-ink">¡Solicitud enviada!</h3>
        <p className="text-muted text-sm max-w-xs leading-relaxed">
          Nuestro equipo comercial te contactará en menos de <strong>24 horas hábiles</strong> con una cotización personalizada.
        </p>
        <button
          onClick={() => { setForm(initialForm(initialProduct, initialCategory)); setStatus("idle"); }}
          className="mt-2 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline hover:opacity-70 transition-opacity"
        >
          Enviar otra solicitud
        </button>
      </motion.div>
    );
  }

  return (
    <div id={formId} className="bento-card scroll-mt-28">
      {/* Header */}
      <div className="mb-8">
        <span
          className="inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full mb-3"
          style={{ background: "rgba(250,183,2,0.12)", color: "#fab702" }}
        >
          Cotización Express
        </span>
        <h2 className="text-2xl font-bold text-ink mb-1">Solicitar Cotización</h2>
        <p className="text-muted text-sm">
          Respuesta garantizada en &lt;24 h hábiles. Sin compromiso.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Nombre + Empresa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            id="qf-nombre"
            name="nombre"
            label="Nombre *"
            type="text"
            placeholder="Juan Martínez"
            value={form.nombre}
            onChange={handleChange}
            error={errors.nombre}
          />
          <Field
            id="qf-empresa"
            name="empresa"
            label="Empresa"
            type="text"
            placeholder="Mi Empresa S.A. de C.V."
            value={form.empresa}
            onChange={handleChange}
          />
        </div>

        {/* Email + Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            id="qf-email"
            name="email"
            label="Correo electrónico *"
            type="email"
            placeholder="tu@empresa.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            id="qf-telefono"
            name="telefono"
            label="Teléfono"
            type="tel"
            placeholder="818 000 0000"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>

        {/* Producto de interés */}
        <Field
          id="qf-interes"
          name="interes"
          label="Producto / Servicio de interés *"
          type="text"
          placeholder="Ej: Terminal Zebra TC57x, Reparación de PLC..."
          value={form.interes}
          onChange={handleChange}
          error={errors.interes}
        />

        {/* Categoría + Cantidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category select */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="qf-categoria"
              className="text-xs font-semibold uppercase tracking-wide text-muted"
            >
              Categoría
            </label>
            <select
              id="qf-categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm text-ink bg-canvas border border-line focus:outline-none focus:border-primary dark:focus:border-accent transition-colors"
            >
              <option value="">Seleccionar categoría</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Field
            id="cantidad"
            name="cantidad"
            label="Cantidad estimada"
            type="text"
            placeholder="Ej: 10+, 50+, 100+"
            value={form.cantidad}
            onChange={handleChange}
          />
        </div>

        {/* Mensaje */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="qf-mensaje"
            className="text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Comentarios adicionales
          </label>
          <textarea
            id="qf-mensaje"
            name="mensaje"
            rows={4}
            value={form.mensaje}
            onChange={handleChange}
            placeholder="Describe tu proyecto, integración requerida, plazos u otros detalles relevantes..."
            className="w-full px-4 py-3 rounded-xl text-sm text-ink bg-canvas border border-line focus:outline-none focus:border-primary dark:focus:border-accent transition-colors placeholder:text-muted/60 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center cursor-pointer justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm uppercase tracking-widest text-primary hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#fab702" }}
        >
          {status === "loading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Enviando…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              Solicitar Cotización
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-muted">
          Al enviar este formulario aceptas nuestra{" "}
          <a href="/privacidad" className="underline hover:text-primary dark:hover:text-accent">
            política de privacidad
          </a>
          .
        </p>
      </form>
    </div>
  );
}

// ─── Field sub-component ─────────────────────────────
interface FieldProps {
  id: string;
  name: keyof FormData;
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

function Field({ id, name, label, type, placeholder, value, onChange, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-4 py-3 rounded-xl text-sm text-ink bg-canvas border transition-colors focus:outline-none placeholder:text-muted/60 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-line focus:border-primary dark:focus:border-accent"
        }`}
      />
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
