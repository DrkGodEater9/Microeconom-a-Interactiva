import { describe, expect, it } from 'vitest';
import { bisect, clamp, curve, interp, linspace, smooth } from '../src/engine/math.js';
import { f$, fn, pct } from '../src/engine/format.js';

describe('math', () => {
  it('linspace incluye los extremos', () => {
    expect(linspace(0, 10, 5)).toEqual([0, 2, 4, 6, 8, 10]);
  });
  it('curve evalúa la función en cada punto', () => {
    expect(curve((x) => x * 2, 0, 2, 2)).toEqual([
      [0, 0],
      [1, 2],
      [2, 4],
    ]);
  });
  it('clamp limita al rango', () => {
    expect([clamp(-1, 0, 5), clamp(3, 0, 5), clamp(9, 0, 5)]).toEqual([0, 3, 5]);
  });
  it('bisect encuentra la raíz de una función decreciente (equilibrio)', () => {
    expect(bisect((p) => 10 - 4 * p - (-2 + 4 * p), 0, 5)).toBeCloseTo(1.5, 6);
  });
  it('interp interpola linealmente y extrapola', () => {
    const f = interp([
      [0, 0],
      [10, 10],
    ]);
    expect([f(5), f(-5), f(15)]).toEqual([5, -5, 15]);
  });
  it('smooth pasa exactamente por los puntos dados', () => {
    const pts = [
      [0, 15],
      [1, 14],
      [2, 12],
      [3, 9],
      [4, 5],
      [5, 0],
    ];
    const f = smooth(pts);
    for (const [x, y] of pts) expect(f(x)).toBeCloseTo(y, 9);
  });
});

describe('format', () => {
  it('da formato de dinero, número y porcentaje', () => {
    expect(f$(1.5)).toBe('$1.50');
    expect(f$(-2, 0)).toBe('−$2');
    expect(fn(1234.5, 1)).toBe('1,234.5');
    expect(pct(0.256, 1)).toBe('25.6%');
  });
});
