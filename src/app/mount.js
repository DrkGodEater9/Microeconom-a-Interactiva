import { FIGS } from '../engine/registry.js';
import { mountFig } from '../engine/figure.js';

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

/** Monta las figuras marcadas con data-fig; las plegables ("figref") se montan al abrirse. */
export function mountFigures(root) {
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
    det.addEventListener('toggle', () => {
      const body = det.querySelector('.figref-body');
      if (det.open && !body.firstChild) {
        const holder = document.createElement('div');
        body.append(holder);
        mountOne(holder, det.dataset.fig);
      }
    });
  });
}
