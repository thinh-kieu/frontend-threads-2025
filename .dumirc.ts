import { defineConfig } from 'dumi';

// const variablesPath = resolve(
//   __dirname,
//   'src/ui/styles/variables.less',
// ).replace(/\\/g, '/');

export default defineConfig({
  base: '/frontend-threads-2025/',
  publicPath: '/frontend-threads-2025/',
  outputPath: 'docs-dist',
  locales: [{ id: 'en-US', name: 'English' }],
  // Import Less variables globally via Less modifyVars hack (Ant Design recommended)
  // theme: {
  //   hack: `true; @import "${variablesPath}";`,
  // },
  themeConfig: {
    name: 'FT2025',
    footer:
      'Copyright © 2025. Built with <a href="https://d.umijs.org" target="_blank" rel="noreferrer">Dumi</a>.',
    socialLinks: {
      github: 'https://github.com/siouxvn/frontend-threads-2025',
    },
    clickToComponent: true,
    editLink: false,
    sourceLink: true,
  },
  copy: ['docs/public/mockServiceWorker.js'],
});
