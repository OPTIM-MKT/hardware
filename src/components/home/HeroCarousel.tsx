"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const slides = [
  {
    id: 1,
    tag: "Soluciones Industriales",
    title: "Si lo puedes\nimaginar, lo\npodemos resolver.",
    subtitle: "Reparación & Mantenimiento",
    description:
      "En el momento menos oportuno, su equipo presenta una falla. Permítanos poner a su servicio nuestra experiencia en reparación de equipos industriales de control.",
    cta: "Contáctanos",
    ctaHref: "/contact",
    bg: "from-primary via-secondary to-[#0a1a40]",
    accent: "#fab702",
  },
  {
    id: 2,
    tag: "Dispositivos Móviles",
    title: "Backup,\nReparación &\nMantenimiento.",
    subtitle: "Terminales · Impresoras · Laptops",
    description:
      "Servicio integral para terminales portátiles, impresoras móviles y laptops de uso rudo. Mantenemos tu operación activa sin interrupciones.",
    cta: "Ver Servicios",
    ctaHref: "/#services",
    bg: "from-[#0a1a40] via-primary to-secondary",
    accent: "#fab702",
  },
  {
    id: 3,
    tag: "Alianzas Tecnológicas",
    title: "Socios de\nlas marcas\nlíderes.",
    subtitle: "Zebra · Honeywell · Datalogic",
    description:
      "Contamos con relaciones cercanas con las marcas punteras que resuelven los problemas de nuestros clientes. Colaboración para el desarrollo de proyectos tecnológicos.",
    cta: "Conoce más",
    ctaHref: "/about",
    bg: "from-secondary via-[#0d1f4a] to-primary",
    accent: "#fab702",
  },
];

const stats = [
  { value: "+500", label: "Equipos Reparados" },
  { value: "+15",  label: "Años de Experiencia" },
  { value: "+120", label: "Clientes Activos" },
  { value: "100%", label: "Cobertura ZMM" },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full" style={{ height: "100svh", minHeight: "600px" }}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        loop
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`} />

            {/* Decorative grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            {/* Glowing circle accent */}
            <div
              className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: "#fab702" }}
            />

            {/* Content */}
            <div className="relative z-10 container-lg h-full flex items-center">
              <div className="max-w-2xl">
                {/* Tag */}
                <AnimatePresence mode="wait">
                  {activeIndex === i && (
                    <motion.div
                      key={`tag-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: slide.accent }}
                      />
                      <span className="text-xs font-semibold tracking-widest uppercase text-white/80">
                        {slide.tag}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Title */}
                <AnimatePresence mode="wait">
                  {activeIndex === i && (
                    <motion.h1
                      key={`title-${i}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-white font-extrabold leading-[1.05] mb-4 whitespace-pre-line"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: "clamp(2.5rem, 6vw, 5rem)",
                      }}
                    >
                      {slide.title}
                    </motion.h1>
                  )}
                </AnimatePresence>

                {/* Subtitle */}
                <AnimatePresence mode="wait">
                  {activeIndex === i && (
                    <motion.p
                      key={`sub-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.35 }}
                      className="text-sm font-semibold uppercase tracking-widest mb-4"
                      style={{ color: slide.accent }}
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Description */}
                <AnimatePresence mode="wait">
                  {activeIndex === i && (
                    <motion.p
                      key={`desc-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.45 }}
                      className="text-white/70 text-base leading-relaxed mb-8 max-w-lg"
                    >
                      {slide.description}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* CTA */}
                <AnimatePresence mode="wait">
                  {activeIndex === i && (
                    <motion.div
                      key={`cta-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.55 }}
                      className="flex flex-wrap gap-4"
                    >
                      <a
                        href={slide.ctaHref}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        style={{
                          background: slide.accent,
                          color: "#013383",
                        }}
                      >
                        {slide.cta}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                      <a
                        href="/#services"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300"
                      >
                        Servicios
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pagination dots */}
      <div className="hero-pagination absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-20" />

      {/* Stats bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10"
        style={{ background: "rgba(1,51,131,0.85)", backdropFilter: "blur(12px)" }}
      >
        <div className="container-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center py-5 px-4"
              >
                <span
                  className="text-2xl md:text-3xl font-extrabold"
                  style={{ color: "#fab702", fontFamily: "'Syne', sans-serif" }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-white/50 mt-1 text-center tracking-wide">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
