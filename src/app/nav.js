import { CHAPTERS } from '../engine/registry.js';
import { PARTS } from './parts.js';
import { $ } from './dom.js';

/** Dibuja el índice lateral marcando el capítulo activo (null = inicio). */
export function renderNav(activeId) {
  let html = `<a href="#/" class="${activeId == null ? 'on' : ''}" style="--pc:var(--ink)"><span class="n">⌂</span>Inicio y cómo usar la guía</a>`;
  for (const part of PARTS) {
    html += `<h6 style="--pc:var(--p${part.n})">Parte ${part.n} · ${part.name}</h6>`;
    for (const id of part.chs) {
      const chapter = CHAPTERS.find((c) => c.id === id);
      if (!chapter) continue;
      html += `<a href="#/c${id}" class="${activeId === id ? 'on' : ''}" style="--pc:var(--p${part.n})"><span class="n">${id}</span><span>${chapter.title}</span></a>`;
    }
  }
  $('#side').innerHTML = html;
}

/** Comportamiento del menú desplegable en pantallas pequeñas. */
export function initNav() {
  const close = () => document.body.classList.remove('nav-open');
  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $('#scrim').addEventListener('click', close);
  $('#side').addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
}
