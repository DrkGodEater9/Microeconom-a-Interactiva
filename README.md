# Microeconomía interactiva

Guía interactiva de microeconomía, capítulo por capítulo, basada en el libro de Parkin, Esquivel y
Ávalos (_Microeconomía. Versión para América Latina_, 7.ª ed.). Cada concepto se explica desde cero y
cada gráfica se puede tocar y mover: al pasar el cursor sobre una curva, un área o un punto, un panel
explica qué representa, y los controles muestran qué significa mover una intersección.

## Funciones de estudio

- **Gráficas de repaso plegables**: donde el texto vuelve a mencionar una curva ya vista aparece «Ver de nuevo la gráfica», cerrada por defecto y con todos sus controles al abrirla (`figAgain('c3_eq', 'nota opcional')` en el HTML del capítulo). Cada capítulo tiene un botón para abrirlas todas.
- **Progreso**: capítulos vistos, cuestionarios perfectos, «Continuar donde lo dejaste» y repaso de preguntas falladas (todo en `localStorage`).
- **Búsqueda** en la barra lateral (sin tildes ni mayúsculas), **índice de secciones** flotante y **enlaces directos** a cada sección (`#/c5/<sección>`).
- Barra lateral contraíble, tema claro/oscuro, accesible con teclado, adaptada a móvil y a impresión.
- **Sin conexión**: fuentes incluidas en el paquete y service worker (PWA instalable).

## Requisitos

- Node.js 18 o superior

## Uso

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # genera la carpeta dist/ (sitio estático)
npm run preview    # sirve dist/ para probar la versión final
```

Calidad del código:

```bash
npm run lint           # ESLint
npm run test           # Vitest (utilidades + prueba de humo de los 20 capítulos)
npm run format         # Prettier (no toca src/content, que son textos largos)
npm run check          # lint + test + build
```

El resultado de `npm run build` usa rutas relativas, así que puede subirse tal cual a cualquier
hosting estático (GitHub Pages, Netlify, un servidor propio, una subcarpeta…).

## Estructura

```
index.html              Estructura base (barra superior, índice lateral, contenido)
src/
  main.js               Punto de entrada
  engine/               Motor reutilizable, sin conocimiento del contenido
    figure.js           mountFig(): gráficas SVG interactivas con controles, resaltado e info
    quiz.js             Cuestionarios de opción múltiple con explicación
    math.js             linspace, curve, bisect, interp, smooth (spline monótona)…
    format.js           f$, fn, pct (formato numérico)
    blocks.js           def, ex, warn, tip, eqn, table… (HTML de los bloques didácticos)
    registry.js         FIGS y CHAPTERS (registros)
  app/                  Aplicación: rutas, vistas, menú, tema, créditos
    views/home.js       Portada
    views/chapter.js    Vista de capítulo
    views/repaso.js     Repaso de preguntas falladas
    progress.js         Progreso y estado guardado
    search.js, sections.js, tools.js   Búsqueda, secciones/enlaces e índice flotante
public/                 Manifest, íconos y service worker (PWA)
  content/
    chapters/chNN.js    Un archivo por capítulo (texto + figuras + cuestionario + términos)
    extras.js           Idea clave, requisitos, resumen y ejercicios guiados por figura
  styles/               CSS por responsabilidad (tokens, base, layout, home, chapter, figure…)
tests/                  Vitest
```

## Cómo agregar o editar contenido

**Un capítulo nuevo.** Crea `src/content/chapters/chNN.js`, importa lo que necesites de
`../../engine/*.js` y registra el capítulo con `CHAPTERS.push({ id, title, teaser, bigq, learn, html,
terms, quiz })`. Añade su `id` a la parte que corresponda en `src/app/parts.js` y su idea clave,
requisitos y resumen en `EXTRA` de `src/content/extras.js`. Las pruebas fallan si falta algo.

**Una figura nueva.** Registra `FIGS.mi_figura = { title, intro, x, y, controls, build(state) }` y
colócala en el HTML del capítulo con `${fig('mi_figura')}`. `build` devuelve:

- `els`: elementos del gráfico (`line`, `area`, `pt`, `txt`, `box`, `arr`). Los que llevan `info`
  son interactivos y aparecen como chips en la leyenda.
- `read`: casillas de lectura rápida; `say`: texto «Qué está pasando» con los valores actuales.
- Varios paneles: usa `panels` y devuelve `panels: [els1, els2]`. Sin gráfico (calculadoras):
  `noplot: true`.
- Controles: `slider` (por defecto), `seg`, `toggle` y `btn`, con `hint` que explica qué significa
  mover cada uno. Los ejercicios guiados se agregan en `TASKS` de `extras.js`.

## Notas

- Los ejemplos numéricos del libro (CD-R, pizzas, camisas, cortes de cabello, la restricción
  presupuestaria de Isabel) se usan tal cual; los demás números son ilustrativos y están marcados
  en la propia página.
- Las fuentes (Source Sans 3 y Source Serif 4) vienen incluidas con `@fontsource`; no se necesita conexión.
- Esta guía es material de estudio derivado del libro; no es una publicación oficial y los derechos
  de la obra pertenecen a sus titulares.
