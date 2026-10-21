import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const bodyHtml = html.match(/<body>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g, '');
const go = (hash) => {
  location.hash = hash;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};

describe('contenido', () => {
  const dir = resolve(process.cwd(), 'src/content/chapters');
  const files = readdirSync(dir).filter((f) => /^ch\d+\.js$/.test(f));
  const sources = files.map((f) => ({
    n: Number(f.match(/\d+/)[0]),
    src: readFileSync(resolve(dir, f), 'utf8'),
  }));

  it('toda figura definida se usa en su capítulo', () => {
    for (const { n, src } of sources) {
      const defined = [...src.matchAll(/FIGS\.(\w+)\s*=/g)].map((m) => m[1]);
      for (const name of defined) {
        expect(src.includes(`fig('${name}')`), `cap ${n}: figura ${name} sin usar`).toBe(true);
      }
    }
  });

  it('los repasos plegables solo apuntan a figuras de capítulos anteriores o del mismo', () => {
    const all = sources.map((s) => s.src).join('\n');
    for (const { n, src } of sources) {
      for (const m of src.matchAll(/figAgain\('(c(\d+)_\w+)'/g)) {
        expect(
          Number(m[2]),
          `cap ${n} repasa ${m[1]} de un capítulo posterior`,
        ).toBeLessThanOrEqual(n);
        expect(all.includes(`FIGS.${m[1]} =`), `figura ${m[1]} no existe`).toBe(true);
      }
    }
  });
});

describe('funciones de estudio', () => {
  let CHAPTERS;
  beforeAll(async () => {
    document.body.innerHTML = bodyHtml;
    window.scrollTo = vi.fn();
    await import('../src/main.js');
    ({ CHAPTERS } = await import('../src/engine/registry.js'));
  });
  beforeEach(() => localStorage.clear());

  it('cada capítulo tiene ids únicos en sus secciones y enlaces directos', async () => {
    const { annotate } = await import('../src/app/sections.js');
    for (const c of CHAPTERS) {
      const { sections } = annotate(c.html, c.id);
      const ids = sections.map((s) => s.id);
      expect(new Set(ids).size, `cap ${c.id}`).toBe(ids.length);
    }
  });

  it('la búsqueda ignora tildes y mayúsculas', async () => {
    const { search } = await import('../src/app/search.js');
    const r = search('ELASTICIDAD');
    expect(r.length).toBeGreaterThan(0);
    expect(search('excedente del consumidor').some((x) => x.ch === 5)).toBe(true);
    expect(search('zzzzqq')).toEqual([]);
  });

  it('un enlace a una sección existe en el capítulo', () => {
    go('#/c5');
    const first = document.querySelector('#main .sec h2');
    expect(first.id).toBeTruthy();
    go(`#/c5/${first.id}`);
    expect(document.getElementById(first.id)).not.toBeNull();
  });

  it('visitar un capítulo lo marca como visto y la portada ofrece continuar', () => {
    go('#/c3');
    go('#/');
    expect(document.querySelector('.resume')?.textContent).toContain('Capítulo 3');
    expect(document.querySelector('#navlinks a[href="#/c3"] .ck')).not.toBeNull();
  });

  it('las preguntas falladas aparecen en el repaso y salen al acertarlas', () => {
    go('#/c1');
    const wrongIdx = CHAPTERS[0].quiz[0].a === 0 ? 1 : 0;
    document.querySelectorAll('#quizmount .q')[0].querySelectorAll('.opt')[wrongIdx].click();
    go('#/repaso');
    expect(document.querySelectorAll('#repmount .q').length).toBe(1);
    const right = CHAPTERS[0].quiz[0].a;
    document.querySelector('#repmount .q .opt:nth-child(' + (right + 1) + ')').click();
    go('#/repaso');
    expect(document.querySelector('#repmount')?.children.length ?? 0).toBe(0);
  });

  it('el botón de repaso abre todas las gráficas plegables y recuerda su estado', async () => {
    go('#/c5');
    document.querySelector('#toggleRefs').click();
    const refs = [...document.querySelectorAll('#main details.figref')];
    expect(refs.every((d) => d.open && d.querySelector('.fig'))).toBe(true);
    await new Promise((r) => setTimeout(r, 20));
    go('#/c4');
    go('#/c5');
    expect([...document.querySelectorAll('#main details.figref')].every((d) => d.open)).toBe(true);
  });

  it('las figuras interactivas son accesibles con teclado', () => {
    go('#/c3');
    const hit = document.querySelector('#main .el.hit');
    expect(hit.getAttribute('tabindex')).toBe('0');
    hit.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(hit.closest('.fig').querySelector('.fig-info.idle')).toBeNull();
  });
});
