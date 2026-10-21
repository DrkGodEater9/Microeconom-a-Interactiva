import { safeGet, safeSet } from './storage.js';

const KEY = 'micro_theme';
const root = document.documentElement;

const systemTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

/** Aplica el tema guardado y conecta el botón de alternancia. */
export function initTheme(button) {
  const saved = safeGet(KEY);
  if (saved) root.dataset.theme = saved;
  button.addEventListener('click', () => {
    const next = (root.dataset.theme || systemTheme()) === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    safeSet(KEY, next);
  });
}
