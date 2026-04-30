"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import type { SwiperClass } from "swiper/react";

const slides = [
  {
    id: 1,
    tag: "Soluciones Industriales",
    title: "Si lo puedes\nimaginar, lo\npodemos resolver.",
    image:
      "https://images.unsplash.com/photo-1561158250-01426799e9e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image:
      "https://images.unsplash.com/photo-1644115019513-8ff6d81c29ea?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

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
    image:
      "https://images.unsplash.com/photo-1618950399704-86fb060cd003?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  { value: "+15", label: "Años de Experiencia" },
  { value: "+120", label: "Clientes Activos" },
  { value: "100%", label: "Cobertura ZMM" },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section
      className="relative w-full"
      style={{ height: "100svh", minHeight: "600px" }}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        className="w-full h-full hero-swiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            {/* Full-bleed photo background */}
            <img
              src={slide.image}
              alt={slide.tag}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />

            {/* Dark gradient overlay – ensures text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(100deg, rgba(1,51,131,0.88) 0%, rgba(35,48,96,0.7) 50%, rgba(1,51,131,0.20) 100%)",
              }}
            />

            {/* Glowing circle accent – keep for depth */}
            <div
              className="absolute top-1/4 right-[15%] w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
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
                      className="text-white font-extrabold leading-[1.1] mb-4 whitespace-pre-line"
                      style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)" }}
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

      {/* ─── Vertical side navigator (right edge, centered) ─── */}
      <nav
        aria-label="Slides"
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-5"
      >
        {slides.map((slide, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={i}
              onClick={() => swiperRef.current?.slideToLoop(i)}
              aria-label={`Ir al slide ${i + 1}: ${slide.tag}`}
              aria-current={isActive ? "true" : undefined}
              className="group flex items-center gap-3 focus:outline-none"
              style={{ direction: "rtl" }}
            >
              {/* Slide tag — visible only on active */}
              <span
                className="text-right transition-all duration-500 overflow-hidden whitespace-nowrap"
                style={{
                  maxWidth: isActive ? "140px" : "0px",
                  opacity: isActive ? 1 : 0,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {slide.tag}
              </span>

              {/* Track + progress bar */}
              <div className="flex flex-col items-center gap-1">
                {/* Number badge */}
                <span
                  className="transition-all duration-300 font-bold tabular-nums"
                  style={{
                    fontSize: isActive ? "0.75rem" : "0.6rem",
                    color: isActive ? "#fab702" : "rgba(255,255,255,0.35)",
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Vertical bar */}
                <div
                  className="relative rounded-full overflow-hidden"
                  style={{
                    width: "2px",
                    height: isActive ? "48px" : "24px",
                    background: "rgba(255,255,255,0.18)",
                    transition: "height 0.4s ease",
                  }}
                >
                  {isActive && (
                    <motion.div
                      key={`progress-${i}`}
                      className="absolute top-0 left-0 right-0 rounded-full"
                      style={{ background: "#fab702" }}
                      initial={{ height: "0%" }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 6, ease: "linear" }}
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Stats bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10"
        style={{
          background: "rgba(1,51,131,0.85)",
          backdropFilter: "blur(12px)",
        }}
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
                  style={{ color: "#fab702" }}
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
