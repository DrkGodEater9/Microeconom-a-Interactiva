import { renderHome } from './views/home.js';
import { renderChapter } from './views/chapter.js';
import { renderRepaso } from './views/repaso.js';
import { clearTools } from './tools.js';

const CHAPTER_HASH = /^#\/c(\d+)(?:\/([\w-]+))?/;
let shown = null; // capítulo en pantalla, para no redibujarlo si solo cambia la sección

const goTo = (slug) => document.getElementById(slug)?.scrollIntoView?.();

/** Dibuja la vista del hash actual: #/, #/repaso, #/c<n> o #/c<n>/<sección>. */
export function renderRoute() {
  const match = location.hash.match(CHAPTER_HASH);
  const id = match ? Number(match[1]) : null;
  const slug = match?.[2];
  if (id != null && id === shown && slug && document.getElementById(slug)) {
    goTo(slug);
    return;
  }
  shown = null;
  if (location.hash === '#/repaso') renderRepaso();
  else if (id != null && renderChapter(id)) shown = id;
  else {
    renderHome();
    clearTools();
  }
  window.scrollTo(0, 0);
  if (shown && slug) goTo(slug);
}

export function startRouter() {
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}
