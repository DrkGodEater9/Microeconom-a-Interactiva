import { safeGet, safeSet } from './storage.js';

const KEY = 'micro_progress';
const EMPTY = () => ({ last: null, visited: {}, quiz: {}, wrong: {}, figs: {} });

function load() {
  try {
    return { ...EMPTY(), ...JSON.parse(safeGet(KEY) || '{}') };
  } catch {
    return EMPTY();
  }
}

function save(state) {
  safeSet(KEY, JSON.stringify(state));
}

function update(fn) {
  const state = load();
  fn(state);
  save(state);
}

export const progress = {
  get: load,
  visit(id) {
    update((s) => {
      s.visited[id] = true;
      s.last = id;
    });
  },
  /** Guarda el resultado de un capítulo (mejor puntaje). */
  finishQuiz(id, score, total) {
    update((s) => {
      const prev = s.quiz[id];
      if (!prev || score >= prev.score) s.quiz[id] = { score, total };
    });
  },
  /** Anota una respuesta: las falladas quedan para el repaso, las acertadas salen. */
  answer(id, qi, correct) {
    update((s) => {
      if (correct) delete s.wrong[`${id}:${qi}`];
      else s.wrong[`${id}:${qi}`] = true;
    });
  },
  wrongList() {
    return Object.keys(load().wrong).map((k) => k.split(':').map(Number));
  },
  isFigOpen: (id, name) => !!load().figs[`${id}:${name}`],
  setFigOpen(id, name, open) {
    update((s) => {
      if (open) s.figs[`${id}:${name}`] = true;
      else delete s.figs[`${id}:${name}`];
    });
  },
  reset() {
    save(EMPTY());
  },
};
