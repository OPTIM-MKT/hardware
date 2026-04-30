"use client";

import { motion } from "framer-motion";
import ScrollReveal from "../shared/ScrollReveal";

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
    title: "Reparación de Equipos",
    description:
      "Diagnóstico y reparación especializada de equipos industriales de control, PLC, HMI, drives y sistemas de automatización sin necesidad de póliza de servicio.",
    color: "from-primary/10 to-primary/5",
    border: "border-primary/20",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 0a2.25 2.25 0 0 0-4.5 0c0 1.242 1.008 2.25 2.25 2.25h3m0 0a2.25 2.25 0 0 0 4.5 0m0 0V9.75" />
      </svg>
    ),
    title: "Dispositivos Móviles",
    description:
      "Backup, reparación y mantenimiento de terminales portátiles, impresoras móviles y laptops de uso rudo. Mantenemos tu fuerza de campo operando.",
    color: "from-accent/10 to-amber-50/20",
    border: "border-accent/20",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
      </svg>
    ),
    title: "Gestión y Monitoreo",
    description:
      "Administración centralizada de dispositivos con monitoreo en tiempo real. Visibilidad total de tu inventario de equipos y su estado operativo.",
    color: "from-secondary/10 to-secondary/5",
    border: "border-secondary/20",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "Administración de Garantías",
    description:
      "Gestión profesional de las garantías de tus equipos. Nos encargamos de todos los procesos con el fabricante para que tú no pierdas tiempo ni dinero.",
    color: "from-green-500/10 to-emerald-50/20",
    border: "border-green-500/20",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    title: "Capacitación",
    description:
      "Cursos especializados en impresoras, terminales y software. Personal calificado que empodera a tu equipo para maximizar el rendimiento de los dispositivos.",
    color: "from-violet-500/10 to-purple-50/20",
    border: "border-violet-500/20",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
      </svg>
    ),
    title: "Instalación",
    description:
      "Instalación profesional de impresoras para credenciales y etiquetas, lectores, terminales y aplicaciones. Instalación sin costo en la ZMM para equipo nuevo.",
    color: "from-orange-500/10 to-orange-50/20",
    border: "border-orange-500/20",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-canvas">
      <div className="container-lg">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full mb-4"
              style={{ background: "rgba(250,183,2,0.12)", color: "#fab702" }}>
              Lo que hacemos
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              Nuestros <span className="text-gradient">Servicios</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto text-base leading-relaxed">
              Ofrecemos soluciones integrales para mantener la operación de tus equipos tecnológicos industriales sin interrupciones.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <ScrollReveal key={svc.title} delay={i * 0.08} direction="up">
              <article
                className={`bento-card group flex flex-col gap-4 bg-gradient-to-br ${svc.color} border ${svc.border} dark:border-white/10 dark:bg-none dark:bg-panel h-full`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(1,51,131,0.08)", color: "var(--color-primary)" }}
                >
                  {svc.icon}
                </div>
                <h3 className="text-lg font-bold text-ink group-hover:text-primary transition-colors">
                  {svc.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed flex-1">{svc.description}</p>
                <a
                  href="/contact"
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent hover:gap-3 transition-all duration-200"
                >
                  Solicitar servicio
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA band */}
        <ScrollReveal delay={0.3} direction="up">
          <div
            className="mt-16 rounded-2xl p-10 text-center text-white flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: "linear-gradient(135deg, #013383 0%, #233060 100%)" }}
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                ¿Tienes un equipo fuera de servicio?
              </h3>
              <p className="text-white/70 text-sm">
                Nuestro equipo técnico está listo para atenderte. Sin póliza, sin complicaciones.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide shrink-0 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
              style={{ background: "#fab702", color: "#013383" }}
            >
              Cotiza Ahora
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
