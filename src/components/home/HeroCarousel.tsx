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

/** Tiempo por slide; la barra de progreso del indicador usa el mismo valor. */
const AUTOPLAY_MS = 3000;

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
        autoplay={{ delay: AUTOPLAY_MS, disableOnInteraction: false }}
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
                        className="inline-flex items-center cursor-pointer gap-2 px-5 py-2.5 md:px-7 md:py-3.5 rounded-full font-semibold text-xs md:text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
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
                        className="inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 md:px-7 md:py-3.5 rounded-full font-semibold text-xs md:text-sm tracking-wide text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300"
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
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-end gap-2"
      >
        {slides.map((slide, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(i)}
              aria-label={`Ir al slide ${i + 1}: ${slide.tag}`}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex items-center cursor-pointer rounded-full p-2 outline-none focus-visible:ring-2 focus-visible:ring-accent/80"
            >
              {/* Etiqueta del slide activo: posicionada fuera del flujo para
                  que nunca se recorte; entra desde la barra hacia la izquierda. */}
              <span
                aria-hidden
                className="absolute right-full mr-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white bg-primary/60 backdrop-blur-md border border-white/15 shadow-[0_4px_16px_rgba(1,20,60,0.35)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-opacity"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateX(0)" : "translateX(8px)",
                  pointerEvents: "none",
                }}
              >
                {slide.tag}
              </span>

              {/* Número + barra de progreso */}
              <span className="flex flex-col items-center gap-1.5 [text-shadow:0_1px_6px_rgba(1,20,60,0.6)]">
                <span
                  className={`font-bold tabular-nums leading-none transition-[color,font-size] duration-300 ${
                    isActive
                      ? "text-xs text-accent"
                      : "text-[0.65rem] text-white/75 group-hover:text-white"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className={`relative block w-[3px] rounded-full overflow-hidden transition-[height,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_0_1px_rgba(1,20,60,0.25)] ${
                    isActive
                      ? "h-12 bg-white/35"
                      : "h-6 bg-white/50 group-hover:bg-white/80"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      key={`progress-${i}`}
                      className="absolute top-0 left-0 right-0 block rounded-full bg-accent"
                      initial={{ height: "0%" }}
                      animate={{ height: "100%" }}
                      transition={{
                        duration: AUTOPLAY_MS / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      {/* ─── Indicador en móvil: barras horizontales sobre la barra de stats ─── */}
      <nav
        aria-label="Slides"
        className="absolute left-0 right-0 bottom-[4.25rem] z-30 md:hidden"
      >
        <div className="container-lg flex gap-0.5 -ml-2.5">
          {slides.map((slide, i) => {
            const isActive = activeIndex === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => swiperRef.current?.slideToLoop(i)}
                aria-label={`Ir al slide ${i + 1}: ${slide.tag}`}
                aria-current={isActive ? "true" : undefined}
                className="cursor-pointer p-2.5 outline-none rounded-full focus-visible:ring-2 focus-visible:ring-accent/80 active:scale-95 transition-transform duration-100 motion-reduce:transform-none"
              >
                <span
                  className={`relative block h-[3px] rounded-full overflow-hidden transition-[width,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive ? "w-10 bg-white/35" : "w-5 bg-white/55"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      key={`progress-m-${i}`}
                      className="absolute inset-y-0 left-0 block rounded-full bg-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: AUTOPLAY_MS / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
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
