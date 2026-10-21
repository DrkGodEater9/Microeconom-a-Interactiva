import '@fontsource/source-sans-3/latin-400.css';
import '@fontsource/source-sans-3/latin-600.css';
import '@fontsource/source-sans-3/latin-700.css';
import '@fontsource/source-serif-4/latin-400.css';
import '@fontsource/source-serif-4/latin-400-italic.css';
import '@fontsource/source-serif-4/latin-600.css';
import '@fontsource/source-serif-4/latin-700.css';
import './styles/main.css';
import './content/index.js';
import { FIGS } from './engine/registry.js';
import { homeFigure } from './content/extras.js';
import { initNav } from './app/nav.js';
import { initTools, initSkipLink } from './app/tools.js';
import { initTheme } from './app/theme.js';
import { startRouter } from './app/router.js';
import { $ } from './app/dom.js';

FIGS.home_eq = homeFigure;
initTheme($('#themeBtn'));
initNav();
initTools();
initSkipLink();

// Sin conexión: el service worker solo se registra en el sitio publicado.
if (import.meta.env?.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('./sw.js').catch(() => {}),
  );
}

// Al imprimir, los términos clave se muestran abiertos.
window.addEventListener('beforeprint', () =>
  document.querySelectorAll('.terms details').forEach((d) => (d.open = true)),
);
startRouter();
