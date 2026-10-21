/** Estructura del libro: partes y capítulos que contiene cada una. */
export const PARTS = [
  { n: 1, name: 'Introducción', chs: [1, 2] },
  { n: 2, name: 'Cómo funcionan los mercados', chs: [3, 4, 5, 6] },
  { n: 3, name: 'Las elecciones de los consumidores', chs: [7, 8] },
  { n: 4, name: 'Empresas y mercados', chs: [9, 10, 11, 12, 13] },
  { n: 5, name: 'Gobierno y fallas del mercado', chs: [14, 15, 16] },
  { n: 6, name: 'Mercado de factores, inequidad e incertidumbre', chs: [17, 18, 19] },
  { n: 7, name: 'La economía global', chs: [20] },
];

export const partOf = (id) => PARTS.find((p) => p.chs.includes(id));
