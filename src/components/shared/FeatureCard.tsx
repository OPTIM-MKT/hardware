import type { ReactNode } from "react";

export interface FeatureCardProps {
  imagen: string;
  titulo: string;
  descripcion: string;
  href: string;
  eyebrow?: string;
  ctaLabel?: string;
  imageAlt?: string;
  className?: string;
  children?: ReactNode;
}

export default function FeatureCard({
  imagen,
  titulo,
  descripcion,
  href,
  eyebrow,
  ctaLabel = "Ver más",
  imageAlt,
  className = "",
  children,
}: FeatureCardProps) {
  return (
    <a
      href={href}
      className={`group bento-card flex flex-col gap-4 p-0 overflow-hidden hover:border-accent/50 transition-colors ${className}`}
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <img
          src={imagen}
          alt={imageAlt ?? titulo}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(1,51,131,0) 40%, rgba(1,51,131,0.55) 100%)",
          }}
        />
        {eyebrow && (
          <span
            className="absolute top-4 left-4 inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full text-primary"
            style={{ background: "#fab702" }}
          >
            {eyebrow}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 px-6 pb-6 flex-1">
        <h3 className="text-lg font-bold text-ink group-hover:text-primary dark:group-hover:text-accent transition-colors leading-snug">
          {titulo}
        </h3>
        <p className="text-muted text-sm leading-relaxed line-clamp-3 flex-1">
          {descripcion}
        </p>

        {children}

        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary dark:text-accent group-hover:gap-3 transition-all mt-1">
          {ctaLabel}
          <svg
            className="w-3 h-3"
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
        </span>
      </div>
    </a>
  );
}
