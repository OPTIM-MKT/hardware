"use client";

import { motion } from "framer-motion";
import ScrollReveal from "../shared/ScrollReveal";

const partners = [
  { name: "Zebra Technologies", abbr: "ZEBRA", category: "Terminales & Impresoras" },
  { name: "Honeywell",          abbr: "HNY",   category: "Escáneres & Movilidad" },
  { name: "Datalogic",          abbr: "DL",    category: "Lectores de Código" },
  { name: "Intermec",           abbr: "IMC",   category: "Equipos Industriales" },
  { name: "SATO",               abbr: "SATO",  category: "Impresión de Etiquetas" },
  { name: "Motorola Solutions", abbr: "MOTO",  category: "Comunicaciones" },
];

export default function PartnersSection() {
  return (
    <section id="partners" className="section-padding" style={{ background: "var(--color-panel)" }}>
      <div className="container-lg">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full mb-4"
              style={{ background: "rgba(1,51,131,0.08)", color: "var(--color-primary)" }}
            >
              Ecosistema de alianzas
            </span>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-ink mb-4"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Socios <span className="text-gradient">Tecnológicos</span>
            </h2>
            <p className="text-muted max-w-lg mx-auto text-base leading-relaxed">
              Nos dimos a la tarea de mantener relaciones cercanas con las marcas líderes que resuelven los problemas de nuestros clientes.
            </p>
          </div>
        </ScrollReveal>

        {/* Partner logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner, i) => (
            <ScrollReveal key={partner.name} delay={i * 0.07} direction="up">
              <div className="bento-card flex flex-col items-center text-center gap-3 py-8 hover:border-primary/30 dark:hover:border-accent/30 transition-colors">
                {/* Logo placeholder – monogram */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-sm tracking-widest"
                  style={{ background: "var(--color-primary)", color: "var(--color-accent)" }}
                >
                  {partner.abbr}
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink leading-tight">{partner.name}</p>
                  <p className="text-xs text-muted mt-0.5">{partner.category}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Statement */}
        <ScrollReveal delay={0.2} direction="up">
          <p className="text-center text-muted text-sm mt-10">
            Creemos en la <strong className="text-ink">colaboración estratégica</strong> para el desarrollo de proyectos tecnológicos de alto impacto.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
