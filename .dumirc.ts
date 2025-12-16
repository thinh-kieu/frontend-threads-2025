import { defineConfig } from 'dumi';

export default defineConfig({
  base: '/frontend-threads-2025/',
  publicPath: '/frontend-threads-2025/',
  outputPath: 'docs-dist',
  locales: [{ id: 'en-US', name: 'English' }],
  themeConfig: {
    name: 'FT2025',
    footer:
      'Copyright © 2025. Built with <a href="https://d.umijs.org" target="_blank" rel="noreferrer">Dumi</a>.',
    socialLinks: {
      github: 'https://github.com/kieukhuongthinh/frontend-threads-2025',
    },
    clickToComponent: true,
  },
});
