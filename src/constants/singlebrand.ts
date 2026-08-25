import zebra from "@/assets/images/brands/zebra.webp";
import connexion from "@/assets/images/brands/3dConnexion.webp";
import ikey from "@/assets/images/brands/ikey.webp";
import type { ImageMetadata } from "astro";

export interface BrandBannerData {
  image?: ImageMetadata;
  title: string;
  badgeText?: string;
  p: string;
  href: string;
  cta: string;
}

export interface MayoreoBannerData {
  title: string;
  badgeText?: string;
  p: string;
  href: string;
  cta: string;
  features?: string[];
}

export const ikeyData: BrandBannerData = {
  image: ikey,
  title: "Ikey",
  badgeText: "Distribuidor autorizado",
  p: "Soluciones de cómputo, teclados y periféricos ultra-resistentes para entornos industriales y médicos.",
  href: "/ikey",
  cta: "Conoce más",
};

export const zebraData: BrandBannerData = {
  image: zebra,
  title: "Zebra",
  badgeText: "Distribuidor autorizado",
  p: "Líder global en sistemas de impresión industrial, identificación y captura de datos para la cadena de suministro.",
  href: "/zebra",
  cta: "Conoce más",
};

export const DconnData: BrandBannerData = {
  image: connexion,
  title: "3Dconnexion",
  badgeText: "Distribuidor autorizado",
  p: "Controladores 3D y ratones ergonómicos de alta precisión para optimizar flujos de trabajo en CAD e ingeniería.",
  href: "/3Dconnexion",
  cta: "Conoce más",
};

export const mayoreoData: MayoreoBannerData = {
  badgeText: "Marcas Líderes Globales para la Continuidad de tu Cadena de Suministro",
  title: "Equipamiento Industrial al Mayoreo: Tecnología, Control y Calidad Operativa",
  p: "Optimiza tu presupuesto con adquisiciones en volumen y bundles comerciales. Proveemos hardware original, soporte técnico capacitado e instalación para equipamiento nuevo.",
  href: "/mayoreo",
  cta: "Cotizar Mayoreo",
  features: [
    "Hardware 100% Original",
    "Garantía de Fábrica",
    "Precios por Volumen",
    "Soporte en Ingeniería",
  ],
};
