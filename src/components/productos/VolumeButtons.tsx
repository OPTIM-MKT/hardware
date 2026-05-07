import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  formId?: string;
  onVolumeSelect?: (volume: string) => void;
}

const volumeOptions = [
  { label: "10+", description: "Pequeño equipo", value: "10+" },
  { label: "50+", description: "Mediana operación", value: "50+" },
  { label: "100+", description: "Gran empresa", value: "100+" },
];

export default function VolumeButtons({ formId = "quote-form", onVolumeSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    onVolumeSelect?.(value);

    // Scroll to the quote form
    const target = document.getElementById(formId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update the quantity field if it exists
      const qtyInput = target.querySelector<HTMLInputElement>(
        "input[name='cantidad'], input[name='quantity'], #cantidad"
      );
      if (qtyInput) {
        qtyInput.value = value;
        qtyInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">
        ¿Cuántas unidades necesitas?
      </p>
      <div className="flex flex-wrap gap-3">
        {volumeOptions.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              whileTap={{ scale: 0.96 }}
              className="relative flex flex-col items-center justify-center px-6 py-3 rounded-2xl border-2 font-bold text-sm transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              style={{
                borderColor: isActive ? "var(--color-accent)" : "var(--color-line)",
                background: isActive
                  ? "rgba(250,183,2,0.12)"
                  : "var(--color-panel)",
                color: isActive ? "var(--color-accent)" : "var(--color-muted)",
              }}
              aria-pressed={isActive}
              aria-label={`Seleccionar ${opt.label} unidades: ${opt.description}`}
            >
              <span
                className="text-xl font-extrabold leading-none"
                style={{ color: isActive ? "#fab702" : "var(--color-ink)" }}
              >
                {opt.label}
              </span>
              <span
                className="text-[10px] font-medium mt-0.5 tracking-wide"
                style={{ color: isActive ? "#fab702" : "var(--color-muted)" }}
              >
                {opt.description}
              </span>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-primary text-[10px] font-bold"
                    style={{ background: "#fab702" }}
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      {selected && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted"
        >
          Seleccionaste{" "}
          <strong className="text-accent">{selected} unidades</strong> →{" "}
          <a
            href={`#${formId}`}
            className="underline hover:text-primary dark:hover:text-accent transition-colors"
          >
            Ve al formulario de cotización
          </a>
        </motion.p>
      )}
    </div>
  );
}
