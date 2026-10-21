import { CHAPTERS } from '../../engine/registry.js';
import { mountQuiz } from '../../engine/quiz.js';
import { progress } from '../progress.js';
import { renderNav } from '../nav.js';
import { clearTools } from '../tools.js';
import { CREDITS } from '../credits.js';
import { $ } from '../dom.js';

/** Repaso: vuelve a plantear las preguntas falladas; al acertarlas salen de la lista. */
export function renderRepaso() {
  const items = progress
    .wrongList()
    .map(([ch, qi]) => {
      const chapter = CHAPTERS.find((c) => c.id === ch);
      const q = chapter?.quiz[qi];
      return q ? { ch, qi, q, chapter } : null;
    })
    .filter(Boolean);
  renderNav(null, 'repaso');
  clearTools();
  document.title = 'Repaso — Microeconomía interactiva';
  $('#main').innerHTML = `<div class="wrap">
    <header class="chead">
      <h1>Repaso de preguntas falladas</h1>
      <p class="bigq">${
        items.length
          ? 'Estas son las preguntas que fallaste en los cuestionarios. Si aciertas una, sale de la lista.'
          : 'No tienes preguntas pendientes. Cuando falles alguna en un cuestionario, aparecerá aquí para repasarla.'
      }</p>
    </header>
    <div id="repmount"></div>
    ${CREDITS}
  </div>`;
  if (!items.length) return;
  mountQuiz(
    $('#repmount'),
    items.map((i) => i.q),
    {
      prefix: (n) =>
        `<a href="#/c${items[n].ch}">Cap. ${items[n].ch}: ${items[n].chapter.title}</a>`,
      onAnswer: (n, ok) => {
        progress.answer(items[n].ch, items[n].qi, ok);
        renderNav(null, 'repaso');
      },
    },
  );
}
