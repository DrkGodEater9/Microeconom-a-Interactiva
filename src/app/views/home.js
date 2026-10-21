import { CHAPTERS } from '../../engine/registry.js';
import { PARTS } from '../parts.js';
import { CREDITS } from '../credits.js';
import { renderNav } from '../nav.js';
import { mountFigures } from '../mount.js';
import { progress } from '../progress.js';
import { $ } from '../dom.js';

export function renderHome() {
  renderNav(null);
  document.title = 'Microeconomía interactiva — aprende cada capítulo con gráficas que se mueven';
  const p = progress.get();
  const seen = Object.keys(p.visited).length;
  const last = CHAPTERS.find((c) => c.id === p.last);
  const resume = last
    ? `<a class="resume" href="#/c${last.id}"><small>Continuar donde lo dejaste</small><b>Capítulo ${last.id}: ${last.title}</b></a>`
    : '';
  const meter = `<div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${CHAPTERS.length}" aria-valuenow="${seen}"><i style="width:${(seen / CHAPTERS.length) * 100}%"></i></div><p class="meter-t">${seen} de ${CHAPTERS.length} capítulos vistos</p>`;
  let html = `<div class="wrap">
  <section class="hero">
    <h1>Aprende microeconomía moviendo las gráficas</h1>
    <p class="lead">Una guía por capítulos basada en el libro de Parkin, Esquivel y Ávalos. No se da nada por sabido: cada concepto se explica desde cero y cada gráfica se puede tocar para ver qué representa cada línea y cada área, y qué significa que se mueva una intersección.</p>
    ${resume}${seen ? meter : ''}
    <div class="figmount" data-fig="home_eq"></div>
  </section>
  <div class="how">
    <div><b>Toca el gráfico</b>Pasa el cursor o toca una curva, un área o un punto: el panel te dice qué es.</div>
    <div><b>Mueve los controles</b>Bajo cada control hay una frase que explica qué significa moverlo.</div>
    <div><b>Practica</b>Cada gráfica tiene ejercicios guiados con la respuesta oculta.</div>
    <div><b>Cierra con el resumen y el cuestionario</b>Cada capítulo termina con las ideas clave y preguntas con explicación.</div>
  </div>`;
  for (const part of PARTS) {
    html += `<h2 class="part-title" style="--pc:var(--p${part.n})">Parte ${part.n} · ${part.name}</h2><ul class="toc">`;
    for (const id of part.chs) {
      const c = CHAPTERS.find((x) => x.id === id);
      if (!c) continue;
      html += `<li><a href="#/c${id}" style="--pc:var(--p${part.n})"><span class="cn">${id}</span><span class="ct">${c.title}${p.quiz[id]?.score === p.quiz[id]?.total ? ' <span class="ck ok">✓</span>' : p.visited[id] ? ' <span class="ck">●</span>' : ''}</span><span class="cd">${c.teaser}</span></a></li>`;
    }
    html += '</ul>';
  }
  html += `${CREDITS}</div>`;
  $('#main').innerHTML = html;
  mountFigures($('#main'));
}
