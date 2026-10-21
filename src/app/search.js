import { CHAPTERS } from '../engine/registry.js';
import { annotate, stripTags } from './sections.js';

const fold = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

let index = null;

function build() {
  const entries = [];
  for (const c of CHAPTERS) {
    entries.push({
      ch: c.id,
      title: `Cap. ${c.id}: ${c.title}`,
      hash: `#/c${c.id}`,
      text: `${c.teaser} ${c.bigq}`,
      w: 3,
    });
    for (const s of annotate(c.html, c.id).sections) {
      entries.push({ ch: c.id, title: s.title, hash: `#/c${c.id}/${s.id}`, text: s.text, w: 2 });
    }
    for (const [term, def] of c.terms) {
      entries.push({
        ch: c.id,
        title: term,
        hash: `#/c${c.id}`,
        text: stripTags(def),
        w: 2.5,
        term: true,
      });
    }
  }
  return entries.map((e) => ({ ...e, ft: fold(e.title), fx: fold(e.text) }));
}

function snippet(text, token) {
  const at = fold(text).indexOf(token);
  if (at < 0) return text.slice(0, 110);
  const from = Math.max(0, at - 40);
  return (from ? '…' : '') + text.slice(from, from + 120) + '…';
}

/** Busca todas las palabras (sin tildes ni mayúsculas) en títulos, secciones, texto y términos. */
export function search(query, limit = 12) {
  index ??= build();
  const tokens = fold(query)
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (!tokens.length) return [];
  return index
    .map((e) => {
      let score = 0;
      for (const t of tokens) {
        const inTitle = e.ft.includes(t);
        const inText = e.fx.includes(t);
        if (!inTitle && !inText) return null;
        score += (inTitle ? e.w * 2 : 0) + (inText ? 1 : 0);
      }
      return { ...e, score, snip: snippet(e.text, tokens[0]) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
