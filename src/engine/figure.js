import { linspace } from './math.js';
import { fn } from './format.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const COL = {
  blue: 'var(--blue)',
  red: 'var(--red)',
  green: 'var(--green)',
  amber: 'var(--amber)',
  purple: 'var(--purple)',
  teal: 'var(--teal)',
  gray: 'var(--muted)',
  ink: 'var(--ink)',
};
const col = (c) => COL[c] || c || 'var(--ink)';

/* ---------- creación de nodos SVG ---------- */
function S(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) {
    if (k === 'style') e.setAttribute('style', attrs[k]);
    else e.setAttribute(k, attrs[k]);
  }
  if (parent) parent.appendChild(e);
  return e;
}
let _uid = 0;

/* =========================================================
   mountFig(root, cfg)
   cfg: {title,intro,hint, x:{label,max,min,ticks,fmt}, y:{...}, h, axes,
         panels:[{title,x,y,axes}], controls:[...], build(st) -> {els|panels,read,say}}
   ========================================================= */
export function mountFig(root, cfg) {
  const st = {};
  (cfg.controls || []).forEach((c) => {
    if (c.id) st[c.id] = c.value;
  });
  let sel = null,
    hov = null;
  const uid = 'f' + ++_uid;
  root.className = 'fig';
  root.innerHTML = '';
  const head = document.createElement('div');
  head.className = 'fig-head';
  head.innerHTML = `<h4>${cfg.title || ''}</h4>${cfg.intro ? `<p>${cfg.intro}</p>` : ''}`;
  const body = document.createElement('div');
  body.className = 'fig-body';
  const main = document.createElement('div');
  main.className = 'fig-main';
  const side = document.createElement('div');
  side.className = 'fig-side';
  const plotsEl = document.createElement('div');
  plotsEl.className = 'plots';
  const legend = document.createElement('div');
  legend.className = 'fig-legend';
  const ctlsEl = document.createElement('div');
  ctlsEl.style.cssText = 'display:flex;flex-direction:column;gap:14px';
  const readEl = document.createElement('div');
  readEl.className = 'readouts';
  const infoEl = document.createElement('div');
  infoEl.className = 'fig-info idle';
  const sayEl = document.createElement('div');
  sayEl.className = 'fig-status';
  main.append(plotsEl, legend);
  side.append(ctlsEl, readEl, infoEl, sayEl);
  body.append(main, side);
  root.append(head, body);
  if (cfg.tasks && cfg.tasks.length) {
    const tk = document.createElement('div');
    tk.className = 'fig-tasks';
    tk.innerHTML =
      '<b>Practica con esta gráfica</b>' +
      cfg.tasks.map((t) => `<details><summary>${t[0]}</summary><p>${t[1]}</p></details>`).join('');
    root.append(tk);
  }
  if (cfg.noplot) {
    main.style.display = 'none';
    body.style.gridTemplateColumns = '1fr';
    side.style.padding = '16px 22px 20px';
    infoEl.style.display = 'none';
  }

  const panelDefs = cfg.noplot
    ? []
    : cfg.panels || [{ x: cfg.x, y: cfg.y, axes: cfg.axes, title: cfg.ptitle }];
  const W = 560,
    H = cfg.h || 400,
    ml = 58,
    mr = 26,
    mt = 34,
    mb = 60;
  const panels = panelDefs.map((pd, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'plot';
    if (pd.title) {
      const t = document.createElement('div');
      t.className = 'plot-title';
      t.textContent = pd.title;
      wrap.append(t);
    }
    const svg = S('svg', {
      viewBox: `0 0 ${W} ${pd.h || H}`,
      role: 'img',
      'aria-label': (cfg.title || '') + (pd.title ? ' – ' + pd.title : ''),
    });
    wrap.append(svg);
    plotsEl.append(wrap);
    const mid = `${uid}p${i}`;
    return { pd, svg, mid, H: pd.h || H };
  });

  /* ---- controles ---- */
  const valEls = {};
  (cfg.controls || []).forEach((c) => {
    const box = document.createElement('div');
    box.className = 'ctl';
    if (c.type === 'btn') {
      const b = document.createElement('button');
      b.className = 'btn';
      b.type = 'button';
      b.textContent = c.label;
      b.onclick = () => c.act(st, draw, syncControls);
      box.append(b);
    } else if (c.type === 'toggle') {
      const l = document.createElement('label');
      l.className = 'tog';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.checked = !!st[c.id];
      inp.onchange = () => {
        st[c.id] = inp.checked;
        draw();
      };
      l.append(inp, document.createTextNode(c.label));
      box.append(l);
      valEls[c.id] = { inp, c };
    } else if (c.type === 'seg') {
      const l = document.createElement('div');
      l.className = 'lbl';
      l.textContent = c.label;
      const seg = document.createElement('div');
      seg.className = 'seg';
      c.options.forEach(([v, t]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = t;
        b.dataset.v = v;
        b.onclick = () => {
          st[c.id] = isNaN(+v) ? v : +v;
          draw();
        };
        seg.append(b);
      });
      box.append(l, seg);
      valEls[c.id] = { seg, c };
    } else {
      const l = document.createElement('label');
      const nm = document.createElement('span');
      nm.textContent = c.label;
      const val = document.createElement('span');
      val.className = 'val';
      l.append(nm, val);
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = c.min;
      inp.max = c.max;
      inp.step = c.step || 1;
      inp.value = c.value;
      inp.setAttribute('aria-label', c.label);
      inp.oninput = () => {
        st[c.id] = +inp.value;
        draw();
      };
      box.append(l, inp);
      valEls[c.id] = { inp, val, c };
    }
    if (c.hint) {
      const hh = document.createElement('div');
      hh.className = 'hint';
      box.append(hh);
      (valEls[c.id] = valEls[c.id] || {}).hintEl = hh;
      valEls[c.id].c = c;
    }
    ctlsEl.append(box);
  });
  function syncControls() {
    for (const id in valEls) {
      const o = valEls[id],
        c = o.c;
      if (!c) continue;
      if (o.inp && c.type !== 'toggle') {
        o.inp.value = st[id];
      }
      if (o.inp && c.type === 'toggle') {
        o.inp.checked = !!st[id];
      }
      if (o.val) {
        o.val.textContent = c.fmt ? c.fmt(st[id], st) : st[id];
      }
      if (o.seg) {
        [...o.seg.children].forEach((b) =>
          b.classList.toggle('on', String(b.dataset.v) === String(st[id])),
        );
      }
      if (o.hintEl) {
        o.hintEl.innerHTML = typeof c.hint === 'function' ? c.hint(st[id], st) : c.hint;
      }
    }
  }

  /* ---- dibujo ---- */
  const RANK = { area: 0, box: 0, line: 1, arr: 1, pt: 2, txt: 3 };
  let lastItems = [];
  function drawPanel(P, els, items) {
    const { pd, svg, mid, H: Hh } = P;
    svg.innerHTML = '';
    const ax = pd.x || {},
      ay = pd.y || {};
    const x0 = ax.min || 0,
      x1 = ax.max || 10,
      y0 = ay.min || 0,
      y1 = ay.max || 10;
    const pw = W - ml - mr,
      ph = Hh - mt - mb;
    const X = (v) => ml + ((v - x0) / (x1 - x0)) * pw,
      Y = (v) => Hh - mb - ((v - y0) / (y1 - y0)) * ph;
    P.X = X;
    P.Y = Y;
    const defs = S('defs', {}, svg);
    const cp = S('clipPath', { id: mid }, defs);
    S('rect', { x: ml, y: mt - 6, width: pw, height: ph + 6 }, cp);
    S('rect', { class: 'bgp', x: ml, y: mt - 6, width: pw, height: ph + 6, rx: 4 }, svg);
    const showAxes = pd.axes !== false;
    if (showAxes) {
      const xt = ax.ticks || linspace(x0, x1, 5),
        yt = ay.ticks || linspace(y0, y1, 5);
      xt.forEach((v) => {
        S('line', { class: 'gridl', x1: X(v), x2: X(v), y1: mt - 6, y2: Hh - mb }, svg);
        const t = S(
          'text',
          { class: 'tick', x: X(v), y: Hh - mb + 17, 'text-anchor': 'middle' },
          svg,
        );
        t.textContent = ax.fmt ? ax.fmt(v) : fn(v, v % 1 ? 1 : 0);
      });
      yt.forEach((v) => {
        S('line', { class: 'gridl', y1: Y(v), y2: Y(v), x1: ml, x2: W - mr }, svg);
        const t = S('text', { class: 'tick', x: ml - 8, y: Y(v) + 4, 'text-anchor': 'end' }, svg);
        t.textContent = ay.fmt ? ay.fmt(v) : fn(v, v % 1 ? 1 : 0);
      });
      S('line', { class: 'axis', x1: ml, x2: W - mr, y1: Hh - mb, y2: Hh - mb }, svg);
      S('line', { class: 'axis', x1: ml, x2: ml, y1: mt - 6, y2: Hh - mb }, svg);
      if (ax.label) {
        const t = S(
          'text',
          { class: 'axt', x: ml + pw / 2, y: Hh - 8, 'text-anchor': 'middle' },
          svg,
        );
        t.textContent = ax.label;
      }
      if (ay.label) {
        const t = S('text', { class: 'axt', x: ml - 46, y: 16, 'text-anchor': 'start' }, svg);
        t.textContent = ay.label;
      }
    }
    const gClip = S('g', { 'clip-path': `url(#${mid})` }, svg);
    const gTop = S('g', {}, svg);
    const sorted = [...els]
      .filter(Boolean)
      .map((e, i) => [e, i])
      .sort((a, b) => RANK[a[0].k] - RANK[b[0].k] || a[1] - b[1])
      .map((a) => a[0]);
    const mk = (c) => {
      const id = `${mid}-ah-${String(c).replace(/[^a-z]/gi, '')}`;
      if (!defs.querySelector('#' + id)) {
        const m = S(
          'marker',
          {
            id,
            viewBox: '0 0 10 10',
            refX: 8,
            refY: 5,
            markerUnits: 'userSpaceOnUse',
            markerWidth: 13,
            markerHeight: 13,
            orient: 'auto-start-reverse',
          },
          defs,
        );
        S('path', { d: 'M0,0 L10,5 L0,10 z', style: `fill:${col(c)}` }, m);
      }
      return id;
    };
    sorted.forEach((e) => {
      const hit = !!e.info;
      const cls = 'el' + (hit ? ' hit' : '');
      const g = S(
        'g',
        { class: cls, 'data-id': e.id || '', style: `color:${col(e.color)}` },
        e.k === 'pt' || e.k === 'txt' || e.k === 'box' ? gTop : gClip,
      );
      let lab = null;
      if (e.k === 'line') {
        const d = e.pts
          .map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1))
          .join('');
        if (hit)
          S(
            'path',
            {
              d,
              fill: 'none',
              stroke: 'transparent',
              'stroke-width': 18,
              'stroke-linecap': 'round',
            },
            g,
          );
        S(
          'path',
          {
            class: 'line shape',
            d,
            fill: 'none',
            style: `stroke:${col(e.color)}`,
            'stroke-width': e.w || 3.2,
            'stroke-dasharray': e.dash || 'none',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          g,
        );
        const lp = e.pts[e.lp != null ? e.lp : e.pts.length - 1];
        lab = e.label && {
          t: typeof e.label === 'string' ? e.label : e.label.t,
          at: e.label.at || lp,
          dx: e.label.dx != null ? e.label.dx : 6,
          dy: e.label.dy != null ? e.label.dy : -7,
          anchor: e.label.anchor || 'start',
        };
      } else if (e.k === 'arr') {
        const [a, b] = [e.from, e.to];
        let d = `M${X(a[0])} ${Y(a[1])} L${X(b[0])} ${Y(b[1])}`;
        if (e.bend) {
          const mx = (X(a[0]) + X(b[0])) / 2 + e.bend[0],
            my = (Y(a[1]) + Y(b[1])) / 2 + e.bend[1];
          d = `M${X(a[0])} ${Y(a[1])} Q${mx} ${my} ${X(b[0])} ${Y(b[1])}`;
        }
        if (hit) S('path', { d, fill: 'none', stroke: 'transparent', 'stroke-width': 18 }, g);
        S(
          'path',
          {
            class: 'line shape',
            d,
            fill: 'none',
            style: `stroke:${col(e.color)}`,
            'stroke-width': e.w || 3,
            'stroke-dasharray': e.dash || 'none',
            'marker-end': `url(#${mk(e.color)})`,
          },
          g,
        );
        lab = e.label && {
          t: e.label,
          at: e.labelAt || [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
          dx: e.ldx || 0,
          dy: e.ldy != null ? e.ldy : -8,
          anchor: e.lanchor || 'middle',
        };
      } else if (e.k === 'area') {
        const d =
          e.pts
            .map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1))
            .join('') + 'Z';
        S(
          'path',
          {
            class: 'areaf shape',
            d,
            style: `fill:${col(e.color)};stroke:${col(e.color)}`,
            'fill-opacity': e.op != null ? e.op : 0.28,
            'stroke-opacity': 0.55,
            'stroke-width': 1.2,
            'stroke-dasharray': e.stroke || 'none',
          },
          g,
        );
        if (e.label) {
          let cx = 0,
            cy = 0;
          e.pts.forEach((p) => {
            cx += p[0];
            cy += p[1];
          });
          cx /= e.pts.length;
          cy /= e.pts.length;
          lab = {
            t: typeof e.label === 'string' ? e.label : e.label.t,
            at: e.label.at || [cx, cy],
            dx: e.label.dx || 0,
            dy: e.label.dy || 4,
            anchor: e.label.anchor || 'middle',
          };
        }
      } else if (e.k === 'pt') {
        if (e.guides) {
          const gx =
              e.gx != null ? e.gx : ax.fmt ? ax.fmt(e.at[0]) : fn(e.at[0], e.at[0] % 1 ? 2 : 0),
            gy = e.gy != null ? e.gy : ay.fmt ? ay.fmt(e.at[1]) : fn(e.at[1], e.at[1] % 1 ? 2 : 0);
          S(
            'line',
            {
              x1: X(e.at[0]),
              x2: X(e.at[0]),
              y1: Y(e.at[1]),
              y2: Hh - mb,
              style: `stroke:${col(e.color)}`,
              'stroke-width': 1.6,
              'stroke-dasharray': '5 4',
            },
            g,
          );
          S(
            'line',
            {
              x1: ml,
              x2: X(e.at[0]),
              y1: Y(e.at[1]),
              y2: Y(e.at[1]),
              style: `stroke:${col(e.color)}`,
              'stroke-width': 1.6,
              'stroke-dasharray': '5 4',
            },
            g,
          );
          const wx = String(gx).length * 7.4 + 10,
            wy = String(gy).length * 7.4 + 10;
          S(
            'rect',
            {
              x: X(e.at[0]) - wx / 2,
              y: Hh - mb + 19,
              width: wx,
              height: 18,
              rx: 5,
              style: `fill:var(--surface);stroke:${col(e.color)}`,
              'stroke-width': 1.2,
            },
            g,
          );
          const tx = S(
            'text',
            {
              class: 'lab',
              x: X(e.at[0]),
              y: Hh - mb + 32,
              'text-anchor': 'middle',
              style: `fill:${col(e.color)};stroke:none`,
            },
            g,
          );
          tx.textContent = gx;
          S(
            'rect',
            {
              x: ml - wy - 3,
              y: Y(e.at[1]) - 9,
              width: wy,
              height: 18,
              rx: 5,
              style: `fill:var(--surface);stroke:${col(e.color)}`,
              'stroke-width': 1.2,
            },
            g,
          );
          const ty = S(
            'text',
            {
              class: 'lab',
              x: ml - 8,
              y: Y(e.at[1]) + 4.5,
              'text-anchor': 'end',
              style: `fill:${col(e.color)};stroke:none`,
            },
            g,
          );
          ty.textContent = gy;
        }
        if (hit)
          S(
            'circle',
            { cx: X(e.at[0]), cy: Y(e.at[1]), r: (e.r || 6) + 9, fill: 'transparent' },
            g,
          );
        S(
          'circle',
          {
            class: 'shape',
            cx: X(e.at[0]),
            cy: Y(e.at[1]),
            r: e.r || 6,
            style: `fill:${col(e.fill || e.color)};stroke:var(--surface);stroke-width:2.2`,
          },
          g,
        );
        lab = e.label && {
          t: typeof e.label === 'string' ? e.label : e.label.t,
          at: e.at,
          dx: e.label.dx != null ? e.label.dx : 10,
          dy: e.label.dy != null ? e.label.dy : -10,
          anchor: e.label.anchor || 'start',
        };
      } else if (e.k === 'box') {
        const cx = X(e.at[0]),
          cy = Y(e.at[1]),
          w = (e.w * pw) / (x1 - x0),
          h = (e.h * ph) / (y1 - y0);
        S(
          'rect',
          {
            class: 'shape',
            x: cx - w / 2,
            y: cy - h / 2,
            width: w,
            height: h,
            rx: 14,
            style: `fill:${col(e.color)};stroke:${col(e.color)}`,
            'fill-opacity': e.op != null ? e.op : 0.16,
            'stroke-width': 2.2,
          },
          g,
        );
        const lines = String(e.t || '').split('\n');
        lines.forEach((ln, i) => {
          const t = S(
            'text',
            {
              x: cx,
              y: cy + 4 + (i - (lines.length - 1) / 2) * 16,
              'text-anchor': 'middle',
              style: 'font-weight:700;font-size:13.5px',
            },
            g,
          );
          t.textContent = ln;
        });
      } else if (e.k === 'txt') {
        const t = S(
          'text',
          {
            class: e.plain ? '' : 'lab',
            x: X(e.at[0]) + (e.dx || 0),
            y: Y(e.at[1]) + (e.dy || 0),
            'text-anchor': e.anchor || 'middle',
            style: `fill:${col(e.color || 'ink')};${e.size ? `font-size:${e.size}px;` : ''}${e.bold === false ? 'font-weight:500' : ''}`,
          },
          g,
        );
        String(e.t)
          .split('\n')
          .forEach((ln, i) => {
            const ts = S('tspan', { x: X(e.at[0]) + (e.dx || 0), dy: i ? 15 : 0 }, t);
            ts.textContent = ln;
          });
      }
      if (lab && lab.t) {
        const t = S(
          'text',
          {
            class: 'lab',
            x: X(lab.at[0]) + lab.dx,
            y: Y(lab.at[1]) + lab.dy,
            'text-anchor': lab.anchor,
            style: `fill:${col(e.color)}`,
          },
          gTop === g ? g : gTop,
        );
        t.textContent = lab.t;
        if (hit) {
          t.style.pointerEvents = 'none';
        }
      }
      if (hit) {
        g.addEventListener('mouseenter', () => {
          hov = e.id;
          paint();
        });
        g.addEventListener('mouseleave', () => {
          hov = null;
          paint();
        });
        g.addEventListener('click', () => {
          sel = sel === e.id ? null : e.id;
          paint();
        });
        if (!items.find((i) => i.id === e.id)) items.push(e);
      }
    });
  }
  function paint() {
    const act = hov || sel;
    panels.forEach((P) => {
      P.svg.classList.toggle('has-active', !!act);
      P.svg
        .querySelectorAll('.el.hit')
        .forEach((g) => g.classList.toggle('is-active', g.dataset.id === act));
    });
    legend.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.id === act));
    const it = lastItems.find((i) => i.id === act);
    if (it) {
      infoEl.className = 'fig-info';
      infoEl.style.setProperty('--c', col(it.color));
      infoEl.innerHTML = `<h5>${it.info[0]}</h5>${it.info[1]}`;
    } else {
      infoEl.className = 'fig-info idle';
      infoEl.style.removeProperty('--c');
      infoEl.innerHTML =
        cfg.hint ||
        '<b>Explora el gráfico.</b> Pasa el cursor o toca cualquier línea, área coloreada o punto (o su etiqueta de abajo) y aquí te explico qué representa.';
    }
  }
  function draw() {
    syncControls();
    const out = cfg.build(st) || {};
    const items = [];
    const lists = out.panels || [out.els || []];
    panels.forEach((P, i) => drawPanel(P, lists[i] || [], items));
    lastItems = items;
    legend.innerHTML = '';
    items
      .filter((i) => i.legend !== false)
      .forEach((i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip' + (i.k === 'area' || i.k === 'box' ? ' sq' : '');
        b.dataset.id = i.id;
        b.style.setProperty('--c', col(i.color));
        b.innerHTML = `<i></i>${i.legend || i.info[0]}`;
        b.onmouseenter = () => {
          hov = i.id;
          paint();
        };
        b.onmouseleave = () => {
          hov = null;
          paint();
        };
        b.onclick = () => {
          sel = sel === i.id ? null : i.id;
          paint();
        };
        legend.append(b);
      });
    readEl.innerHTML = (out.read || [])
      .map(
        (r) =>
          `<div class="tile" style="--c:${col(r[2] || 'gray')}"><span>${r[0]}</span><b>${r[1]}</b></div>`,
      )
      .join('');
    readEl.style.display = out.read && out.read.length ? '' : 'none';
    if (out.say) {
      sayEl.style.display = '';
      sayEl.innerHTML = `<b class="t">${out.sayTitle || 'Qué está pasando ahora'}</b>${out.say}`;
    } else sayEl.style.display = 'none';
    paint();
  }
  draw();
  return { st, draw };
}
