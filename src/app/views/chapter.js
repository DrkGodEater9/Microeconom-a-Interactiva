import { CHAPTERS } from '../../engine/registry.js';
import { mountQuiz } from '../../engine/quiz.js';
import { partOf } from '../parts.js';
import { CREDITS } from '../credits.js';
import { renderNav } from '../nav.js';
import { mountFigures } from '../mount.js';
import { $ } from '../dom.js';

const list = (items, tag = 'li') => items.map((x) => `<${tag}>${x}</${tag}>`).join('');

function prerequisites(chapter) {
  if (!chapter.pre?.length) return '';
  const links = chapter.pre
    .map((n) => CHAPTERS.find((x) => x.id === n))
    .filter(Boolean)
    .map((t) => `<a href="#/c${t.id}">cap. ${t.id} (${t.title})</a>`);
  return `<div class="prereq">Conviene haber visto antes: ${links.join(', ')}.</div>`;
}

/** Devuelve false si el capítulo no existe. */
export function renderChapter(id) {
  const chapter = CHAPTERS.find((x) => x.id === id);
  if (!chapter) return false;
  const part = partOf(id);
  const prev = CHAPTERS.find((x) => x.id === id - 1);
  const next = CHAPTERS.find((x) => x.id === id + 1);
  renderNav(id);
  document.title = `Cap. ${id}: ${chapter.title} — Microeconomía interactiva`;
  $('#main').innerHTML = `<div class="wrap" style="--pc:var(--p${part.n})">
   <header class="chead">
     <div class="kicker">Capítulo ${id} · Parte ${part.n}: ${part.name}</div>
     <h1>${chapter.title}</h1>
     <p class="bigq">${chapter.bigq}</p>
     ${chapter.key ? `<div class="keyidea"><b>La idea en una frase</b>${chapter.key}</div>` : ''}
     <div class="learn"><b>Al terminar este capítulo vas a poder:</b><ul>${list(chapter.learn)}</ul></div>
     ${prerequisites(chapter)}
   </header>
   <div class="sec">${chapter.html}</div>
   ${chapter.sum ? `<h2 class="block-title">Resumen: lo que debes llevarte</h2><div class="summary"><ul>${list(chapter.sum)}</ul></div>` : ''}
   <h2 class="block-title">Términos clave, explicados simple</h2>
   <div class="terms">${chapter.terms.map((t) => `<details><summary>${t[0]}</summary><p>${t[1]}</p></details>`).join('')}</div>
   <h2 class="block-title">Ponte a prueba</h2>
   <div id="quizmount"></div>
   <div class="pager">${prev ? `<a href="#/c${prev.id}"><small>← Capítulo anterior</small><b>${prev.title}</b></a>` : '<span></span>'}${next ? `<a class="nx" href="#/c${next.id}"><small>Siguiente capítulo →</small><b>${next.title}</b></a>` : ''}</div>
   ${CREDITS}
  </div>`;
  mountFigures($('#main'));
  mountQuiz($('#quizmount'), chapter.quiz);
  return true;
}
