import { $ } from './dom.js';

let observer = null;

/** Botones flotantes: índice de secciones del capítulo y volver arriba. */
export function setTools(sections, chapterId) {
  const fab = $('#fab');
  const panel = $('#secpanel');
  observer?.disconnect();
  panel.hidden = true;
  fab.hidden = false;
  panel.innerHTML =
    '<b>En este capítulo</b>' +
    sections
      .map((s) => `<a href="#/c${chapterId}/${s.id}" data-sec="${s.id}">${s.title}</a>`)
      .join('');
  const links = new Map([...panel.querySelectorAll('a')].map((a) => [a.dataset.sec, a]));
  if (typeof IntersectionObserver === 'undefined') return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) => a.classList.remove('cur'));
        links.get(entry.target.id)?.classList.add('cur');
      }
    },
    { rootMargin: '-70px 0px -70% 0px' },
  );
  links.forEach((_, id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

/** Oculta los botones flotantes (portada y repaso). */
export function clearTools() {
  observer?.disconnect();
  $('#fab').hidden = true;
  $('#secpanel').hidden = true;
}

export function initTools() {
  const panel = $('#secpanel');
  const btn = $('#secBtn');
  btn.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    btn.setAttribute('aria-expanded', String(!panel.hidden));
  });
  $('#topBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  panel.addEventListener('click', (event) => {
    if (event.target.closest('a')) panel.hidden = true;
  });
  const top = $('#topBtn');
  const sync = () => top.classList.toggle('show', window.scrollY > 500);
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') panel.hidden = true;
  });
}

/** Enlace "saltar al contenido" (el hash está reservado para el enrutador). */
export function initSkipLink() {
  document.querySelector('.skip')?.addEventListener('click', (event) => {
    event.preventDefault();
    $('#main').focus();
  });
}
