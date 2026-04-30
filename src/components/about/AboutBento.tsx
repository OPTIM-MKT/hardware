import ScrollReveal from "../shared/ScrollReveal";

const values = [
  {
    icon: "🛡️",
    title: "Confiabilidad",
    desc: "Más de 15 años respaldando la operación de empresas líderes en la ZMM con resultados consistentes.",
  },
  {
    icon: "⚡",
    title: "Rapidez",
    desc: "Tiempos de respuesta optimizados para minimizar el impacto de cualquier falla en su producción.",
  },
  {
    icon: "🎯",
    title: "Especialización",
    desc: "Técnicos certificados por los principales fabricantes de equipos industriales de control.",
  },
  {
    icon: "🤝",
    title: "Compromiso",
    desc: "Nos convertimos en un aliado estratégico de su área de operaciones, no solo en un proveedor.",
  },
];

const milestones = [
  {
    year: "2008",
    title: "Fundación",
    desc: "Nace Hard-Ware con el compromiso de dar servicio técnico sin burocracia.",
  },
  {
    year: "2012",
    title: "Alianzas",
    desc: "Formalizamos relaciones con Zebra, Honeywell y Datalogic.",
  },
  {
    year: "2017",
    title: "Expansión",
    desc: "Ampliamos servicios a gestión de garantías y monitoreo de flota.",
  },
  {
    year: "2024",
    title: "Hoy",
    desc: "+500 equipos reparados al año. +120 clientes activos en la ZMM.",
  },
];

const team = [
  { name: "Carlos Hdez.", role: "Director General", initial: "CH" },
  { name: "Ana López", role: "Jefe de Servicio Técnico", initial: "AL" },
  {
    name: "Iván Torres",
    role: "Especialista Zebra & Honeywell",
    initial: "IT",
  },
  { name: "Sofía Ramírez", role: "Ejecutiva de Cuenta", initial: "SR" },
];

export default function AboutBento() {
  return (
    <div className="section-padding">
      <div className="container-lg">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block text-black dark:text-white bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full mb-4">
              Nuestra historia
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-black dark:text-white mb-4">
              Somos <span className="text-gradient">Hard-Ware</span>
            </h1>
            <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Somos una
              empresa especializada en soluciones tecnológicas industriales con
              más de 15 años de experiencia en Monterrey, Nuevo León.
            </p>
          </div>
        </ScrollReveal>

        {/* Main bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Mission – large card */}
          <ScrollReveal direction="left" className="lg:col-span-2">
            <div
              className="bento-card text-white h-full min-h-[240px] flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, #013383 0%, #233060 100%)",
              }}
            >
              <div>
                <span
                  className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full mb-4"
                  style={{
                    background: "rgba(250,183,2,0.2)",
                    color: "#fab702",
                  }}
                >
                  Misión
                </span>
                <h2 className="text-2xl font-bold mb-3">
                  Cuidamos tu operación
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-lg">
                  Nuestra misión es garantizar la continuidad operativa de
                  nuestros clientes a través de servicios técnicos
                  especializados, oportunos y de alta calidad. Creemos que una
                  empresa no debe detenerse por una falla de equipo.
                </p>
              </div>
              <div className="flex gap-6 mt-8">
                {[
                  ["15+", "Años"],
                  ["500+", "Equipos/año"],
                  ["120+", "Clientes"],
                ].map(([val, lbl]) => (
                  <div key={lbl}>
                    <p
                      className="text-2xl font-extrabold"
                      style={{
                        color: "#fab702",
                      }}
                    >
                      {val}
                    </p>
                    <p className="text-xs text-white/50 uppercase tracking-wide">
                      {lbl}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Vision */}
          <ScrollReveal direction="right">
            <div className="bento-card h-full min-h-[240px] flex flex-col">
              <span className="text-3xl mb-4">🔭</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                Visión
              </span>
              <h3 className="text-xl font-bold text-ink mb-3">
                Líderes en soporte técnico industrial
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Ser el aliado tecnológico de referencia para la industria en el
                norte de México, reconocidos por nuestra rapidez,
                especialización y compromiso con la operación de nuestros
                clientes.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Values row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 0.08} direction="up">
              <div className="bento-card flex flex-col gap-3 text-center items-center">
                <span className="text-4xl">{v.icon}</span>
                <h4 className="font-bold text-ink text-sm">{v.title}</h4>
                <p className="text-muted text-xs leading-relaxed">{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Timeline */}
        {/* <ScrollReveal direction="up" delay={0.1}>
          <div className="bento-card mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted mb-6 block">
              Nuestra trayectoria
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {milestones.map((m, i) => (
                <div key={m.year} className="relative">
                  {i < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-3 left-full w-full h-px bg-line -translate-x-4" />
                  )}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-3"
                    style={{
                      background: "var(--color-primary)",
                      color: "var(--color-accent)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-lg font-extrabold text-accent">{m.year}</p>
                  <p className="font-semibold text-ink text-sm mb-1">
                    {m.title}
                  </p>
                  <p className="text-muted text-xs leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal> */}

        {/* Team */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mb-8">
            <h3 className="text-2xl font-extrabold text-black dark:text-white mb-6 text-center">
              Nuestro Equipo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {team.map((member, i) => (
                <div
                  key={member.name}
                  className="bento-card flex flex-col items-center text-center gap-3"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{
                      background: "linear-gradient(135deg, #013383, #233060)",
                      color: "#fab702",
                    }}
                  >
                    {member.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">
                      {member.name}
                    </p>
                    <p className="text-muted text-xs mt-0.5">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" delay={0.2}>
          <div
            className="rounded-2xl p-10 text-center text-white"
            style={{ background: "linear-gradient(135deg, #013383, #233060)" }}
          >
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              ¿Quieres ser parte de nuestros clientes?
            </h3>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Lorem ipsum dolor sit amet consectetur adipiscing elit.
              Contáctanos y descubre cómo podemos mantener tus equipos operando
              al máximo.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: "#fab702", color: "#013383" }}
            >
              Contáctanos →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
