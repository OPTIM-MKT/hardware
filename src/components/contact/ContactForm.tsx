import { useState } from "react";
import ScrollReveal from "../shared/ScrollReveal";

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI demo – no real submission
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl"
          style={{ background: "rgba(250,183,2,0.15)", color: "#fab702" }}
        >
          ✓
        </div>
        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
          ¡Mensaje enviado!
        </h3>
        <p className="text-muted text-sm max-w-xs">
          Gracias por contactarnos. Nuestro equipo te responderá en menos de 24
          horas hábiles.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <ScrollReveal direction="up">
      <div className="bento-card">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
          Envíanos un mensaje
        </h2>
        <p className="text-muted text-sm mb-8">
          Ten el primer contacto con nuestro personal altamente capacitado.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5"
            >
              Nombre *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Juan Martínez"
              className="w-full px-4 py-3 rounded-xl text-sm text-ink bg-canvas border border-line focus:outline-none focus:border-primary dark:focus:border-accent transition-colors placeholder:text-muted/60"
            />
          </div>

          {/* Phone + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5"
              >
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="818 000 0000"
                className="w-full px-4 py-3 rounded-xl text-sm text-ink bg-canvas border border-line focus:outline-none focus:border-primary dark:focus:border-accent transition-colors placeholder:text-muted/60"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5"
              >
                Correo electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="tu@empresa.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-ink bg-canvas border border-line focus:outline-none focus:border-primary dark:focus:border-accent transition-colors placeholder:text-muted/60"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5"
            >
              Mensaje *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Describa brevemente el equipo que necesita reparación o el servicio que requiere..."
              className="w-full px-4 py-3 rounded-xl text-sm text-ink bg-canvas border border-line focus:outline-none focus:border-primary dark:focus:border-accent transition-colors placeholder:text-muted/60 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center cursor-pointer justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm uppercase tracking-widest text-primary hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            style={{ background: "#fab702" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
            Enviar Mensaje
          </button>
        </form>
      </div>
    </ScrollReveal>
  );
}
