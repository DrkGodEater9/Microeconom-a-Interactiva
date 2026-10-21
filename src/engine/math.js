/** Utilidades matemáticas para construir curvas y resolver equilibrios. */
/* ---------- matemáticas auxiliares ---------- */
export const linspace = (a, b, n = 60) =>
  Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
export const curve = (f, a, b, n = 60) => linspace(a, b, n).map((x) => [x, f(x)]);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export function bisect(f, lo, hi, it = 60) {
  let flo = f(lo);
  for (let i = 0; i < it; i++) {
    const m = (lo + hi) / 2,
      fm = f(m);
    if (fm < 0 === flo < 0) {
      lo = m;
      flo = fm;
    } else hi = m;
  }
  return (lo + hi) / 2;
}
export function interp(pts) {
  // lineal por tramos con extrapolación en extremos
  return (x) => {
    const n = pts.length;
    if (x <= pts[0][0]) {
      const [x0, y0] = pts[0],
        [x1, y1] = pts[1];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
    for (let i = 1; i < n; i++) {
      if (x <= pts[i][0] || i === n - 1) {
        const [x0, y0] = pts[i - 1],
          [x1, y1] = pts[i];
        return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
      }
    }
  };
}

/* spline monótona (Fritsch–Carlson) para curvas suaves que pasan por puntos del libro */
export function smooth(pts) {
  const n = pts.length,
    h = [],
    d = [],
    m = new Array(n);
  for (let i = 0; i < n - 1; i++) {
    h[i] = pts[i + 1][0] - pts[i][0];
    d[i] = (pts[i + 1][1] - pts[i][1]) / h[i];
  }
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i],
      b = m[i + 1] / d[i],
      s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return (x) => {
    if (x <= pts[0][0]) return pts[0][1];
    if (x >= pts[n - 1][0]) return pts[n - 1][1];
    let i = 0;
    while (x > pts[i + 1][0]) i++;
    const t = (x - pts[i][0]) / h[i],
      t2 = t * t,
      t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * pts[i][1] +
      (t3 - 2 * t2 + t) * h[i] * m[i] +
      (-2 * t3 + 3 * t2) * pts[i + 1][1] +
      (t3 - t2) * h[i] * m[i + 1]
    );
  };
}
