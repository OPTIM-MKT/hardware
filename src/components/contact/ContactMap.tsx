"use client";

import ScrollReveal from "../shared/ScrollReveal";

export default function ContactMap() {
  return (
    <ScrollReveal direction="up" delay={0.15}>
      <div className="bento-card overflow-hidden !p-0">
        <div className="p-5 border-b border-line">
          <h3 className="text-base font-bold text-ink" style={{ fontFamily: "'Syne', sans-serif" }}>
            Encuéntranos
          </h3>
          <p className="text-xs text-muted mt-0.5">Rio Papaloapan #308, Col. Mexico, Monterrey, N.L.</p>
        </div>
        <div className="relative w-full" style={{ paddingBottom: "60%", minHeight: "280px" }}>
          <iframe
            title="Hard-Ware ubicación"
            className="absolute inset-0 w-full h-full border-0"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.3559!2d-100.3161!3d25.6866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866295c5c05a7a0d%3A0x1234567890abcdef!2sRio%20Papaloapan%20308%2C%20M%C3%A9xico%2C%2064710%20Monterrey%2C%20N.L.!5e0!3m2!1ses!2smx!4v1713000000000!5m2!1ses!2smx"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="p-4 bg-primary/5 dark:bg-panel flex items-center justify-between">
          <p className="text-xs text-muted">Lunes – Viernes: 8:00 am – 6:00 pm</p>
          <a
            href="https://goo.gl/maps/monterrey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-accent hover:underline"
          >
            Ver en Google Maps
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </ScrollReveal>
  );
}
