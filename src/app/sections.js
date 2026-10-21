/** Secciones (h2/h3) de un capítulo: ids estables para enlaces directos, índice y búsqueda. */

export function slugify(text) {
  return text
    .replace(/<[^>]+>/g, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export const stripTags = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/** Devuelve el HTML con id en cada h2/h3 y la lista de secciones con su texto. */
export function annotate(html, chapterId) {
  const used = new Set();
  const sections = [];
  const parts = html.split(/(<h[23]>[\s\S]*?<\/h[23]>)/);
  let out = '';
  let current = null;
  for (const part of parts) {
    const m = part.match(/^<h([23])>([\s\S]*?)<\/h[23]>$/);
    if (!m) {
      out += part;
      if (current) current.text += ' ' + stripTags(part);
      continue;
    }
    const title = stripTags(m[2]);
    let id = slugify(title) || 'seccion';
    for (let n = 2; used.has(id); n++) id = `${slugify(title) || 'seccion'}-${n}`;
    used.add(id);
    current = { level: Number(m[1]), id, title, text: '' };
    sections.push(current);
    out += `<h${m[1]} id="${id}">${m[2]}<a class="anchor" href="#/c${chapterId}/${id}" aria-label="Enlace a esta sección">#</a></h${m[1]}>`;
  }
  return { html: out, sections };
}
