/** Formateo numérico (estilo del libro: punto decimal, signo menos tipográfico). */
export const f$ = (n, d = 2) => {
  const s = Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
  return (n < 0 ? '−$' : '$') + s;
};
export const fn = (n, d = 1) =>
  (n < 0 ? '−' : '') +
  Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const pct = (n, d = 0) => fn(n * 100, d) + '%';
