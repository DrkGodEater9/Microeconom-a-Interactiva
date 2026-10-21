import { renderHome } from './views/home.js';
import { renderChapter } from './views/chapter.js';

const CHAPTER_HASH = /^#\/c(\d+)/;

/** Dibuja la vista que corresponde al hash actual (#/ o #/c<número>). */
export function renderRoute() {
  const match = location.hash.match(CHAPTER_HASH);
  if (!match || !renderChapter(Number(match[1]))) renderHome();
  window.scrollTo(0, 0);
}

export function startRouter() {
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}
