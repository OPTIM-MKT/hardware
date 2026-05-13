import ScrollReveal from "../shared/ScrollReveal";

interface Pillar {
  icon: string;
  title: string;
  description: string;
}

interface ValuePropositionProps {
  pillars?: Pillar[];
  title?: string;
  eyebrow?: string;
  intro?: string;
  highlightTitle?: string;
  highlightBody?: string;
}

const DEFAULT_PILLARS: Pillar[] = [
  {
    icon: "🇲🇽",
    title: "Distribución autorizada en México",
    description:
      "Inventario y soporte en territorio nacional, garantía de fábrica y precios oficiales sin intermediarios.",
  },
  {
    icon: "🛠️",
    title: "Asesoría técnica especializada",
    description:
      "Ingenieros certificados que diseñan la solución correcta para cada operación, antes y después de la compra.",
  },
  {
    icon: "🌐",
    title: "Conexión con marcas globales",
    description:
      "Aliados directos de fabricantes líderes: acceso a roadmap, capacitación oficial y nuevos productos antes que el mercado.",
  },
  {
    icon: "📦",
    title: "Pedidos a gran escala",
    description:
      "Capacidad para abastecer despliegues nacionales con cientos o miles de unidades, manejo logístico y forecast.",
  },
  {
    icon: "🤝",
    title: "Atención personalizada",
    description:
      "Cada cliente tiene un ejecutivo dedicado. Sin call centers, sin tickets perdidos, con respuesta en menos de 24 h.",
  },
  {
    icon: "🔧",
    title: "Soluciones integrales",
    description:
      "No solo vendemos hardware: integramos software, consumibles, instalación, capacitación y mantenimiento.",
  },
];

export default function ValueProposition({
  pillars = DEFAULT_PILLARS,
  eyebrow = "Por qué HardWare",
  title = "No vendemos productos. Entregamos soluciones tecnológicas integrales.",
  intro = "HardWare es distribuidor autorizado en México de las marcas más exigentes en tecnología industrial. Nuestro trabajo no termina con la compra: lo continuamos durante toda la vida útil de tus equipos.",
  highlightTitle = "Alianza con MG Industrial Imports",
  highlightBody = "Para soluciones de motorreductores, variadores y servoaccionamientos SEW Eurodrive en México, HardWare opera en alianza con MG Industrial Imports. Esto nos permite ofrecer accionamientos industriales con respaldo técnico local y tiempos de entrega competitivos.",
}: ValuePropositionProps) {
  return (
    <section className="section-padding">
      <div className="container-lg">
        <ScrollReveal>
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <span
              className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full mb-4"
              style={{ background: "rgba(250,183,2,0.12)", color: "#fab702" }}
            >
              {eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white mb-5 leading-tight">
              {title}
            </h2>
            <p className="text-muted text-base leading-relaxed">{intro}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.title} direction="up" delay={i * 0.06}>
              <article className="bento-card flex flex-col gap-3 h-full">
                <span className="text-3xl">{pillar.icon}</span>
                <h3 className="text-lg font-bold text-ink leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.1}>
          <div
            className="rounded-3xl p-8 md:p-12 text-white grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center"
            style={{
              background:
                "linear-gradient(135deg, #013383 0%, #233060 60%, #0a1a40 100%)",
            }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl tracking-widest shrink-0"
              style={{ background: "#fab702", color: "#013383" }}
            >
              SEW
            </div>
            <div>
              <span
                className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3"
                style={{
                  background: "rgba(250,183,2,0.18)",
                  color: "#fab702",
                }}
              >
                Alianza estratégica
              </span>
              <h3 className="text-2xl font-extrabold mb-2 leading-tight">
                {highlightTitle}
              </h3>
              <p className="text-white/75 text-sm leading-relaxed max-w-2xl">
                {highlightBody}
              </p>
              <a
                href="/productos"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-xs uppercase tracking-widest bg-accent text-primary hover:-translate-y-0.5 transition-all duration-300"
              >
                Ver catálogo
                <svg
                  className="w-3.5 h-3.5"
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
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
