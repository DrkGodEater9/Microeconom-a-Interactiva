import { FIGS } from '../engine/registry.js';
import { mountFig } from '../engine/figure.js';
import { progress } from './progress.js';

function mountOne(el, name) {
  const entry = FIGS[name];
  if (!entry) {
    el.textContent = `(figura no encontrada: ${name})`;
    return;
  }
  try {
    mountFig(el, typeof entry === 'function' ? entry() : entry);
  } catch (error) {
    el.textContent = `Error en figura ${name}: ${error.message}`;
    console.error(error);
  }
}

/** Monta la gráfica de un repaso plegable la primera vez que se abre. */
function ensureMounted(det) {
  const body = det.querySelector('.figref-body');
  if (det.open && !body.firstChild) {
    const holder = document.createElement('div');
    body.append(holder);
    mountOne(holder, det.dataset.fig);
  }
}

/** Abre o cierra todos los repasos plegables de un contenedor. */
export function setAllFigrefs(root, open) {
  root.querySelectorAll('details.figref').forEach((det) => {
    det.open = open;
    ensureMounted(det);
  });
}

/**
 * Monta las figuras marcadas con data-fig; las plegables ("figref") se montan al abrirse
 * y, si se pasa el capítulo, recuerdan si el lector las dejó abiertas.
 */
export function mountFigures(root, chapterId = null) {
  root.querySelectorAll('.figmount').forEach((el) => mountOne(el, el.dataset.fig));
  root.querySelectorAll('details.figref').forEach((det) => {
    const entry = FIGS[det.dataset.fig];
    const cfg = typeof entry === 'function' ? entry() : entry;
    const summary = det.querySelector('summary');
    if (!cfg) {
      summary.textContent = `(figura no encontrada: ${det.dataset.fig})`;
      return;
    }
    summary.innerHTML = `<span class="figref-ico" aria-hidden="true">📈</span> Ver de nuevo la gráfica: <b>${cfg.title || det.dataset.fig}</b>`;
    if (chapterId != null && progress.isFigOpen(chapterId, det.dataset.fig)) det.open = true;
    ensureMounted(det);
    det.addEventListener('toggle', () => {
      ensureMounted(det);
      if (chapterId != null) progress.setFigOpen(chapterId, det.dataset.fig, det.open);
    });
  });
}
