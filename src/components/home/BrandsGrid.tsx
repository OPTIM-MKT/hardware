"use client";

import { motion } from "framer-motion";
import ScrollReveal from "../shared/ScrollReveal";

// Brand data — links to /marcas/[slug]
const brands = [
  {
    slug: "zebra",
    nombre: "Zebra Technologies",
    abbr: "ZEBRA",
    category: "Terminales & Impresoras",
    distribuidorMX: true,
  },
  {
    slug: "honeywell",
    nombre: "Honeywell",
    abbr: "HNY",
    category: "Escáneres & Movilidad",
    distribuidorMX: true,
  },
  {
    slug: "datalogic",
    nombre: "Datalogic",
    abbr: "DL",
    category: "Lectores de Código",
    distribuidorMX: false,
  },
  {
    slug: "sato",
    nombre: "SATO",
    abbr: "SATO",
    category: "Impresión de Etiquetas",
    distribuidorMX: true,
  },
  {
    slug: "motorola",
    nombre: "Motorola Solutions",
    abbr: "MOTO",
    category: "Comunicaciones",
    distribuidorMX: false,
  },
  {
    slug: "intermec",
    nombre: "Intermec",
    abbr: "IMC",
    category: "Equipos Industriales",
    distribuidorMX: false,
  },
];

export default function BrandsGrid() {
  return (
    <section
      id="marcas"
      className="section-padding bg-slate-50 dark:bg-blue-900/20 transition-colors duration-500"
    >
      <div className="container-lg">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full mb-4 text-primary bg-primary/10 dark:bg-primary/5 dark:text-accent">
              Marcas que representamos
            </span>
            <h2 className="text-4xl font-extrabold dark:text-white text-black mb-4">
              Distribuidores <span className="text-gradient">Autorizados</span>
            </h2>
            <p className="text-muted max-w-lg mx-auto text-base leading-relaxed">
              Alianzas directas con los fabricantes líderes en tecnología industrial, impresión e identificación automática.
            </p>
          </div>
        </ScrollReveal>

        {/* Brand logo grid – each card links to /marcas/[slug] */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand, i) => (
            <ScrollReveal key={brand.slug} delay={i * 0.07} direction="up">
              <a
                href={`/marcas/${brand.slug}`}
                className="bento-card group flex flex-col items-center text-center gap-3 py-8 hover:border-primary dark:hover:border-accent transition-colors relative"
                aria-label={`Ver productos de ${brand.nombre}`}
              >
                {/* Distributor badge */}
                {brand.distribuidorMX && (
                  <span
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-primary"
                    style={{ background: "#fab702" }}
                    title="Distribuidor Autorizado MX"
                  >
                    ✓
                  </span>
                )}

                {/* Logo monogram */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-sm tracking-widest transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--color-accent)",
                  }}
                >
                  {brand.abbr}
                </div>
                <div>
                  <p className="font-semibold text-sm text-black dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {brand.nombre}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{brand.category}</p>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* Statement + CTA */}
        <ScrollReveal delay={0.2} direction="up">
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted text-sm">
              ¿Tu marca no aparece?{" "}
              <strong className="text-black dark:text-white">
                Pregúntanos por disponibilidad.
              </strong>
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-primary hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
              style={{ background: "#fab702" }}
            >
              Consultar disponibilidad
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
