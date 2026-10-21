import { FIGS } from '../engine/registry.js';
import { mountFig } from '../engine/figure.js';

/** Monta todas las figuras marcadas con data-fig dentro de un contenedor. */
export function mountFigures(root) {
  root.querySelectorAll('.figmount').forEach((el) => {
    const entry = FIGS[el.dataset.fig];
    if (!entry) {
      el.textContent = `(figura no encontrada: ${el.dataset.fig})`;
      return;
    }
    try {
      mountFig(el, typeof entry === 'function' ? entry() : entry);
    } catch (error) {
      el.textContent = `Error en figura ${el.dataset.fig}: ${error.message}`;
      console.error(error);
    }
  });
}
