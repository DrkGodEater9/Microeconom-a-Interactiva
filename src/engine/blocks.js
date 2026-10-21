/** Generadores de bloques HTML para el contenido de los capítulos. */
/* ---------- bloques de contenido (HTML) ---------- */
export const def = (t, h) => `<div class="def"><b>${t}</b>${h}</div>`;
export const ex = (t, h) => `<div class="ex"><b>${t}</b>${h}</div>`;
export const warn = (h, t = 'Ojo: error muy común') => `<div class="warn"><b>${t}</b>${h}</div>`;
export const tip = (h, t = 'Truco para recordarlo') => `<div class="tip"><b>${t}</b>${h}</div>`;
export const eqn = (h, small = '') =>
  `<div class="eq">${h}${small ? `<small>${small}</small>` : ''}</div>`;
export const fig = (n) => `<div class="figmount" data-fig="${n}"></div>`;
export const table = (head, rows) =>
  `<table class="tb"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
export const K = (c, t) => `<span class="k-${c}">${t}</span>`;
