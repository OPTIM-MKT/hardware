"use client";

import ScrollReveal from "../shared/ScrollReveal";

export default function HomeContactTeaser() {
  return (
    <section
      id="contact-teaser"
      className="section-padding bg-slate-50 dark:bg-slate-950"
    >
      <div className="container-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <ScrollReveal direction="left">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full mb-4">
              Hablemos
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-5 leading-tight">
              ¿Listo para cuidar
              <br />
              <span className="text-gradient">tu operación?</span>
            </h2>
            <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ponemos a
              su disposición nuestra experiencia técnica para que sus equipos
              estén siempre en óptimas condiciones.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #013383, #233060)",
                }}
              >
                Contactar ahora
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
              <a
                href="tel:+528183652769"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide border border-line text-black dark:text-white hover:border-primary hover:text-primary transition-all duration-300"
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                818 3652 769
              </a>
            </div>
          </ScrollReveal>

          {/* Right: info cards */}
          <ScrollReveal direction="right" delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "📍", title: "Ubicación", value: "Monterrey, N.L." },
                { icon: "⏰", title: "Horario", value: "Lun–Vie 8am–6pm" },
                {
                  icon: "📧",
                  title: "Email",
                  value: "ventas.online@\nhard-ware.com.mx",
                },
                { icon: "📞", title: "Teléfono", value: "818 3652 769" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bento-card flex flex-col gap-2"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-200">
                    {item.title}
                  </p>
                  <p className="text-sm font-medium text-black dark:text-slate-300 whitespace-pre-line">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
