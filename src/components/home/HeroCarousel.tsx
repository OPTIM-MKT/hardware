"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import type { SwiperClass } from "swiper/react";

const slides = [
  {
    id: 1,
    tag: "Soluciones Industriales B2B",
    title: "Tecnología,\nimpresión e\nidentificación",
    subtitle: "Soluciones industriales para empresas en México",
    description:
      "Soluciones industriales en tecnología, impresión, identificación y automatización para empresas en México. Distribuidor autorizado Zebra, Honeywell y más.",
    cta: "Ver productos",
    ctaHref: "/productos",
    cta2: "Cotizar",
    cta2Href: "/contact",
    bg: "from-primary via-secondary to-[#0a1a40]",
    accent: "#fab702",
  },
  {
    id: 2,
    tag: "Identificación & Automatización",
    title: "Trazabilidad\ntotal para tu\noperación.",
    subtitle: "Terminales · Impresoras · Escáneres · RFID",
    description:
      "Implementamos sistemas de identificación automática y trazabilidad end-to-end que reducen errores y aumentan la eficiencia de tu cadena de suministro.",
    cta: "Ver Productos",
    ctaHref: "/productos",
    cta2: "Hablar con un experto",
    cta2Href: "/contact",
    bg: "from-[#0a1a40] via-primary to-secondary",
    accent: "#fab702",
  },
  {
    id: 3,
    tag: "Distribuidores Autorizados",
    title: "Socios de las\nmarcas líderes\nen México.",
    subtitle: "Zebra · Honeywell · SATO · Datalogic",
    description:
      "Distribuidor autorizado oficial en México. Garantía de fábrica, soporte técnico especializado y acceso a programas de servicio directo del fabricante.",
    cta: "Ver productos",
    ctaHref: "/productos",
    cta2: "Conocer más",
    cta2Href: "/about",
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

export default function HeroCarousel({ images }: { images?: string[] }) {
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
              src={images ? images[i] : ""}
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
            <div className="relative z-10 container-lg h-full flex items-end pb-36 md:items-center md:pb-0">
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
                      className="inline-flex items-center gap-2 mb-3 md:mb-6 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: slide.accent }}
                      />
                      <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-white/80">
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
                      className="text-white font-extrabold leading-[1.08] mb-2 md:mb-4 whitespace-pre-line"
                      style={{ fontSize: "clamp(1.35rem, 4vw, 3.5rem)" }}
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
                      className="text-[11px] md:text-sm font-semibold uppercase tracking-widest mb-2 md:mb-4"
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
                      className="text-white/70 text-sm md:text-base leading-relaxed mb-4 md:mb-8 max-w-lg hidden md:block"
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
                      className="flex flex-wrap gap-2 md:gap-4"
                    >
                      <a
                        href={slide.ctaHref}
                        className="inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3.5 rounded-full font-semibold text-xs md:text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
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
                        href={slide.cta2Href}
                        className="inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3.5 rounded-full font-semibold text-xs md:text-sm tracking-wide text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300"
                      >
                        {slide.cta2}
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
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-5"
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
          <div className="grid grid-cols-4 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center py-2.5 px-2 md:py-5 md:px-4"
              >
                <span
                  className="text-base md:text-3xl font-extrabold"
                  style={{ color: "#fab702" }}
                >
                  {stat.value}
                </span>
                <span className="text-[9px] md:text-xs text-white/50 mt-0.5 md:mt-1 text-center tracking-wide">
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
