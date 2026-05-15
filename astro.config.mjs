// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';

import robotsTxt from 'astro-robots-txt';

import icon from 'astro-icon';


export default defineConfig({
  site: 'https://www.hard-ware.com.mx/',
  output: "server",
  image: {
    remotePatterns: [{ protocol: "https" }],
  },
  adapter: netlify({
    imageCDN: false,
  }),

  integrations: [
    react(),
    icon(),
    robotsTxt(),
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: {
          es: "es-MX",
          en: "en-US",
        },
      },
    }),
  ],


  vite: {
    plugins: [tailwindcss()]
  },

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

});