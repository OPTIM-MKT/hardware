import * as React from "react";
import type { ContactFormData, CartItemPayload } from "./contact.schema";

interface EmailTemplateProps {
  data: ContactFormData;
  presupuestoLabel?: string;
  timelineLabel?: string;
}

const BRAND = {
  primary: "#013383",
  shade: "#233060",
  accent: "#fab702",
  ink: "#0d1b3e",
  surface: "#ffffff",
  surface2: "#f8f9fc",
  border: "#e2e8f0",
  muted: "#6b7a99",
} as const;

const s = {
  wrapper: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: BRAND.surface2,
    padding: "40px 20px",
    margin: 0,
  } as React.CSSProperties,

  card: {
    maxWidth: 620,
    margin: "0 auto",
    backgroundColor: BRAND.surface,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(1,51,131,0.08)",
    border: `1px solid ${BRAND.border}`,
  } as React.CSSProperties,

  header: {
    background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.shade} 100%)`,
    padding: "36px 40px",
  } as React.CSSProperties,

  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.02em",
  } as React.CSSProperties,

  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    margin: "6px 0 0",
  } as React.CSSProperties,

  logoBadge: {
    display: "inline-block",
    backgroundColor: BRAND.accent,
    borderRadius: 8,
    padding: "4px 12px",
    color: BRAND.primary,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: 16,
  } as React.CSSProperties,

  body: { padding: "32px 40px" } as React.CSSProperties,

  greeting: {
    fontSize: 16,
    color: BRAND.ink,
    marginBottom: 24,
    lineHeight: 1.6,
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: BRAND.primary,
    margin: "0 0 12px",
  } as React.CSSProperties,

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 12,
  } as React.CSSProperties,

  fieldBox: {
    backgroundColor: BRAND.surface2,
    borderRadius: 10,
    padding: "12px 16px",
    border: `1px solid ${BRAND.border}`,
  } as React.CSSProperties,

  fieldBoxFull: {
    backgroundColor: BRAND.surface2,
    borderRadius: 10,
    padding: "12px 16px",
    border: `1px solid ${BRAND.border}`,
    marginBottom: 12,
  } as React.CSSProperties,

  fieldLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: BRAND.muted,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: 4,
  } as React.CSSProperties,

  fieldValue: {
    fontSize: 14,
    color: BRAND.ink,
    fontWeight: 500,
    margin: 0,
  } as React.CSSProperties,

  badge: {
    display: "inline-block",
    backgroundColor: `${BRAND.primary}18`,
    color: BRAND.primary,
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
  } as React.CSSProperties,

  divider: {
    border: "none",
    borderTop: `1px solid ${BRAND.border}`,
    margin: "24px 0",
  } as React.CSSProperties,

  messageBox: {
    backgroundColor: `${BRAND.accent}14`,
    border: `1px solid ${BRAND.accent}33`,
    borderRadius: 10,
    padding: "16px",
    marginBottom: 24,
  } as React.CSSProperties,

  messageText: {
    fontSize: 14,
    color: BRAND.ink,
    lineHeight: 1.7,
    margin: 0,
  } as React.CSSProperties,

  productRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderBottom: `1px solid ${BRAND.border}`,
    fontSize: 13,
    color: BRAND.ink,
  } as React.CSSProperties,

  footer: {
    borderTop: `1px solid ${BRAND.border}`,
    padding: "20px 40px",
    backgroundColor: BRAND.surface2,
    textAlign: "center" as const,
  } as React.CSSProperties,

  footerText: {
    fontSize: 12,
    color: BRAND.muted,
    margin: 0,
    lineHeight: 1.6,
  } as React.CSSProperties,
};

function Field({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div style={s.fieldBox}>
      <span style={s.fieldLabel}>{label}</span>
      {badge ? (
        <span style={s.badge}>{value}</span>
      ) : (
        <p style={s.fieldValue}>{value}</p>
      )}
    </div>
  );
}

export function EmailTemplate({
  data,
  presupuestoLabel,
  timelineLabel,
}: EmailTemplateProps) {
  const isProductos = data.modo === "productos";

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.logoBadge}>Hard-Ware</div>
          <h1 style={s.headerTitle}>
            {isProductos
              ? "Nueva solicitud de cotización · Productos"
              : "Nueva solicitud de cotización · Proyecto"}
          </h1>
          <p style={s.headerSubtitle}>
            {data.nombre} ha enviado una solicitud desde el sitio web.
          </p>
        </div>

        <div style={s.body}>
          <p style={s.greeting}>
            Hola equipo, han recibido un nuevo mensaje de{" "}
            <strong>{data.nombre}</strong>. A continuación los detalles:
          </p>

          <p style={s.sectionTitle}>Información de contacto</p>
          <div style={s.grid}>
            <Field label="Nombre completo" value={data.nombre} />
            <Field label="Teléfono" value={data.telefono} />
          </div>
          <div style={s.fieldBoxFull}>
            <span style={s.fieldLabel}>Correo electrónico</span>
            <p style={s.fieldValue}>{data.email}</p>
          </div>
          {data.empresa && (
            <div style={{ ...s.fieldBoxFull, marginBottom: 24 }}>
              <span style={s.fieldLabel}>Empresa</span>
              <p style={s.fieldValue}>{data.empresa}</p>
            </div>
          )}

          <hr style={s.divider} />

          {isProductos ? (
            <ProductosBlock items={data.items} />
          ) : (
            <ProyectoBlock
              descripcion={data.descripcionProyecto}
              presupuestoLabel={presupuestoLabel ?? data.presupuesto}
              timelineLabel={timelineLabel ?? data.timeline}
            />
          )}

          {data.mensaje && (
            <div style={s.messageBox}>
              <span
                style={{
                  ...s.fieldLabel,
                  color: BRAND.primary,
                  marginBottom: 8,
                }}
              >
                Comentarios adicionales
              </span>
              <p style={s.messageText}>{data.mensaje}</p>
            </div>
          )}
        </div>

        <div style={s.footer}>
          <p style={s.footerText}>
            Este correo fue generado automáticamente por el formulario de contacto de{" "}
            <strong>hard-ware.com.mx</strong>. Responde directamente para contactar al
            cliente — la dirección reply-to ya está configurada.
          </p>
          <p style={{ ...s.footerText, marginTop: 8 }}>
            © {new Date().getFullYear()} Hard-Ware · Distribuidor autorizado en México
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductosBlock({ items }: { items: CartItemPayload[] }) {
  return (
    <>
      <p style={s.sectionTitle}>
        Productos solicitados ({items.length})
      </p>
      <div
        style={{
          backgroundColor: BRAND.surface2,
          borderRadius: 10,
          border: `1px solid ${BRAND.border}`,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {items.map((it, idx) => (
          <div
            key={it.slug}
            style={{
              ...s.productRow,
              borderBottom:
                idx === items.length - 1 ? "none" : `1px solid ${BRAND.border}`,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: BRAND.muted,
                  margin: "0 0 2px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                }}
              >
                {it.marca} · {it.categoria}
              </p>
              <p style={{ margin: 0, fontWeight: 600 }}>{it.nombre}</p>
              {it.sku && (
                <p style={{ fontSize: 11, color: BRAND.muted, margin: "2px 0 0" }}>
                  SKU: {it.sku}
                </p>
              )}
            </div>
            <div style={{ alignSelf: "center", fontWeight: 700 }}>
              ×{it.cantidad}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ProyectoBlock({
  descripcion,
  presupuestoLabel,
  timelineLabel,
}: {
  descripcion: string;
  presupuestoLabel: string;
  timelineLabel: string;
}) {
  return (
    <>
      <p style={s.sectionTitle}>Detalles del proyecto</p>
      <div style={s.grid}>
        <Field label="Presupuesto" value={presupuestoLabel} badge />
        <Field label="Horizonte" value={timelineLabel} badge />
      </div>
      <div style={s.fieldBoxFull}>
        <span style={s.fieldLabel}>Descripción del proyecto</span>
        <p style={{ ...s.fieldValue, whiteSpace: "pre-line" }}>{descripcion}</p>
      </div>
    </>
  );
}
