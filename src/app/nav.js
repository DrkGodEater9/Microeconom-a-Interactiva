import { CHAPTERS } from '../engine/registry.js';
import { PARTS } from './parts.js';
import { $ } from './dom.js';
import { safeGet, safeSet } from './storage.js';

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

const KEY = 'micro-nav-collapsed';
const mobile = () => window.innerWidth <= 900;

/** Menú desplegable en pantallas pequeñas y barra contraíble en escritorio. */
export function initNav() {
  const body = document.body;
  const btn = $('#menuBtn');
  const sync = () => {
    const open = mobile()
      ? body.classList.contains('nav-open')
      : !body.classList.contains('nav-collapsed');
    btn.setAttribute('aria-expanded', String(open));
  };
  const close = () => {
    body.classList.remove('nav-open');
    sync();
  };
  if (safeGet(KEY) === '1') body.classList.add('nav-collapsed');
  btn.addEventListener('click', () => {
    if (mobile()) body.classList.toggle('nav-open');
    else {
      body.classList.toggle('nav-collapsed');
      safeSet(KEY, body.classList.contains('nav-collapsed') ? '1' : '0');
    }
    sync();
  });
  $('#scrim').addEventListener('click', close);
  $('#side').addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  window.addEventListener('resize', sync);
  sync();
}
