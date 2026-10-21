import { beforeAll, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const bodyHtml = html.match(/<body>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g, '');

async function go(hash) {
  location.hash = hash;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

describe('aplicación', () => {
  let CHAPTERS;
  beforeAll(async () => {
    document.body.innerHTML = bodyHtml;
    window.scrollTo = vi.fn();
    await import('../src/main.js');
    ({ CHAPTERS } = await import('../src/engine/registry.js'));
  });

  it('registra los 20 capítulos en orden', () => {
    expect(CHAPTERS.map((c) => c.id)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it('cada capítulo tiene idea clave, resumen y cuestionario válido', () => {
    for (const c of CHAPTERS) {
      expect(c.key, `cap ${c.id} sin idea clave`).toBeTruthy();
      expect(c.sum?.length, `cap ${c.id} sin resumen`).toBeGreaterThan(0);
      for (const q of c.quiz) {
        expect(q.a).toBeGreaterThanOrEqual(0);
        expect(q.a).toBeLessThan(q.o.length);
      }
    }
  });

  it('la portada se dibuja con la figura, el índice y los créditos', async () => {
    await go('#/');
    const main = document.querySelector('#main');
    expect(main.querySelectorAll('.fig').length).toBe(1);
    expect(main.querySelectorAll('.toc a').length).toBe(20);
    expect(main.querySelector('.credits')).not.toBeNull();
  });

  it('todos los capítulos montan sus figuras sin errores', async () => {
    for (const c of CHAPTERS) {
      await go(`#/c${c.id}`);
      const main = document.querySelector('#main');
      expect(main.textContent, `cap ${c.id}`).not.toMatch(/Error en figura|figura no encontrada/);
      expect(main.querySelectorAll('.fig').length, `cap ${c.id} sin figuras`).toBeGreaterThan(0);
      expect(main.querySelectorAll('.q').length).toBeGreaterThan(0);
      expect(main.querySelector('.credits')).not.toBeNull();
    }
  });

  it('las gráficas plegables se montan solo al abrirse', async () => {
    await go('#/c5');
    const det = document.querySelector('#main details.figref');
    expect(det).not.toBeNull();
    expect(det.querySelector('summary').textContent).toContain('Ver de nuevo la gráfica');
    expect(det.querySelector('.fig')).toBeNull();
    det.open = true;
    det.dispatchEvent(new Event('toggle'));
    expect(det.querySelector('.fig')).not.toBeNull();
  });

  it('todas las gráficas plegables apuntan a figuras existentes', async () => {
    for (const c of CHAPTERS) {
      await go(`#/c${c.id}`);
      document.querySelectorAll('#main details.figref').forEach((d) => {
        expect(d.querySelector('summary').textContent, `cap ${c.id}`).not.toMatch(/no encontrada/);
      });
    }
  });

  it('el menú lateral marca el capítulo activo', async () => {
    await go('#/c5');
    expect(document.querySelector('#side a.on').textContent).toContain('Eficiencia y equidad');
  });
});
