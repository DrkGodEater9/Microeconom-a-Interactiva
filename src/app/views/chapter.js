import { CHAPTERS } from '../../engine/registry.js';
import { mountQuiz } from '../../engine/quiz.js';
import { partOf } from '../parts.js';
import { CREDITS } from '../credits.js';
import { renderNav } from '../nav.js';
import { mountFigures, setAllFigrefs } from '../mount.js';
import { annotate } from '../sections.js';
import { progress } from '../progress.js';
import { setTools } from '../tools.js';
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
  const { html, sections } = annotate(chapter.html, id);
  const hasRefs = html.includes('class="figref"');
  progress.visit(id);
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
     <div class="tools">
       ${hasRefs ? '<button type="button" class="btn" id="toggleRefs" aria-pressed="false">Abrir todas las gráficas de repaso</button>' : ''}
       <button type="button" class="btn" id="printBtn">Imprimir / guardar PDF</button>
     </div>
   </header>
   <div class="sec">${html}</div>
   ${chapter.sum ? `<h2 class="block-title" id="resumen">Resumen: lo que debes llevarte</h2><div class="summary"><ul>${list(chapter.sum)}</ul></div>` : ''}
   <h2 class="block-title" id="terminos">Términos clave, explicados simple</h2>
   <div class="terms">${chapter.terms.map((t) => `<details><summary>${t[0]}</summary><p>${t[1]}</p></details>`).join('')}</div>
   <h2 class="block-title" id="quiz">Ponte a prueba</h2>
   <div id="quizmount"></div>
   <div class="pager">${prev ? `<a href="#/c${prev.id}"><small>← Capítulo anterior</small><b>${prev.title}</b></a>` : '<span></span>'}${next ? `<a class="nx" href="#/c${next.id}"><small>Siguiente capítulo →</small><b>${next.title}</b></a>` : ''}</div>
   ${CREDITS}
  </div>`;
  const main = $('#main');
  mountFigures(main, id);
  mountQuiz($('#quizmount'), chapter.quiz, {
    onAnswer: (qi, ok) => progress.answer(id, qi, ok),
    onDone: (score, total) => {
      progress.finishQuiz(id, score, total);
      renderNav(id);
    },
  });
  const toggle = $('#toggleRefs');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-pressed') !== 'true';
      setAllFigrefs(main, open);
      toggle.setAttribute('aria-pressed', String(open));
      toggle.textContent = open
        ? 'Cerrar todas las gráficas de repaso'
        : 'Abrir todas las gráficas de repaso';
    });
  }
  $('#printBtn').addEventListener('click', () => window.print());
  setTools(
    [
      ...sections.filter((s) => s.level === 2).map((s) => ({ id: s.id, title: s.title })),
      { id: 'resumen', title: 'Resumen' },
      { id: 'terminos', title: 'Términos clave' },
      { id: 'quiz', title: 'Ponte a prueba' },
    ],
    id,
  );
  return true;
}
