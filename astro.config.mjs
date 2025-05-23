// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import svgr from 'vite-plugin-svgr'

// https://astro.build/config
export default defineConfig({
  site: 'https://jingpengzhang.github.io',
  vite: {
    plugins: [tailwindcss(), svgr()],
  },
  integrations: [react()],
});