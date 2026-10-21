import { CHAPTERS } from '../engine/registry.js';
import { PARTS } from './parts.js';
import { $ } from './dom.js';
import { safeGet, safeSet } from './storage.js';
import { progress } from './progress.js';
import { search } from './search.js';

/** Dibuja el índice lateral marcando el capítulo activo (null = inicio) y el progreso. */
export function renderNav(activeId, extra = '') {
  const p = progress.get();
  const wrong = progress.wrongList().length;
  const mark = (id) => {
    const q = p.quiz[id];
    if (q && q.score === q.total)
      return '<span class="ck ok" title="Cuestionario perfecto">✓</span>';
    if (p.visited[id]) return '<span class="ck" title="Capítulo visto">●</span>';
    return '';
  };
  let html = `<a href="#/" class="${activeId == null && extra !== 'repaso' ? 'on' : ''}" style="--pc:var(--ink)"><span class="n">⌂</span>Inicio y cómo usar la guía</a>`;
  html += `<a href="#/repaso" class="${extra === 'repaso' ? 'on' : ''}" style="--pc:var(--ink)"><span class="n">↻</span><span>Repaso de preguntas falladas${wrong ? ` <b class="badge">${wrong}</b>` : ''}</span></a>`;
  for (const part of PARTS) {
    html += `<h6 style="--pc:var(--p${part.n})">Parte ${part.n} · ${part.name}</h6>`;
    for (const id of part.chs) {
      const chapter = CHAPTERS.find((c) => c.id === id);
      if (!chapter) continue;
      html += `<a href="#/c${id}" class="${activeId === id ? 'on' : ''}" style="--pc:var(--p${part.n})"><span class="n">${id}</span><span>${chapter.title}</span>${mark(id)}</a>`;
    }
  }
  $('#navlinks').innerHTML = html;
}

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function initSearch() {
  const input = $('#searchInput');
  const box = $('#searchRes');
  const links = $('#navlinks');
  const run = () => {
    const q = input.value.trim();
    box.hidden = !q;
    links.hidden = !!q;
    if (!q) return;
    const results = search(q);
    box.innerHTML = results.length
      ? results
          .map(
            (r) =>
              `<a href="${r.hash}"><span class="n">${r.ch}</span><span><b>${esc(r.title)}</b><small>${esc(r.snip)}</small></span></a>`,
          )
          .join('')
      : '<p class="nores">Sin resultados. Prueba con otra palabra.</p>';
  };
  input.addEventListener('input', run);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      input.value = '';
      run();
    }
  });
  box.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      input.value = '';
      run();
    }
  });
}

const KEY = 'micro-nav-collapsed';
const mobile = () => window.innerWidth <= 900;

/** Menú desplegable en pantallas pequeñas, barra contraíble en escritorio y buscador. */
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
  initSearch();
  sync();
}
