/** Cuestionario de opción múltiple con explicación por respuesta.
 *  opts: { onAnswer(i, acierto), onDone(aciertos, total), prefix(i) -> HTML previo a la pregunta } */
export function mountQuiz(root, qs, opts = {}) {
  let score = 0,
    done = 0;
  root.className = 'quiz';
  root.innerHTML = '';
  const sc = document.createElement('div');
  sc.className = 'quiz-score';
  sc.setAttribute('aria-live', 'polite');
  sc.textContent = `Aciertos: 0 de ${qs.length}`;
  qs.forEach((q, qi) => {
    const d = document.createElement('div');
    d.className = 'q';
    const pre = opts.prefix ? `<small class="qpre">${opts.prefix(qi)}</small>` : '';
    d.innerHTML = `${pre}<p class="qq">${qi + 1}. ${q.q}</p><div class="opts"></div><div class="why"></div>`;
    const o = d.querySelector('.opts');
    q.o.forEach((t, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.innerHTML = t;
      b.onclick = () => {
        if (d.classList.contains('done')) return;
        d.classList.add('done');
        done++;
        [...o.children].forEach((x, j) => {
          if (j === q.a) x.classList.add('ok');
        });
        const ok = i === q.a;
        if (ok) score++;
        else b.classList.add('bad');
        d.querySelector('.why').innerHTML =
          (ok
            ? '<b style="color:var(--green)">¡Correcto!</b> '
            : '<b style="color:var(--red)">No exactamente.</b> ') + q.why;
        opts.onAnswer?.(qi, ok);
        sc.textContent =
          `Aciertos: ${score} de ${qs.length}` +
          (done === qs.length
            ? score === qs.length
              ? ' — ¡perfecto!'
              : ' — repasa las explicaciones.'
            : '');
        if (done === qs.length) {
          opts.onDone?.(score, qs.length);
          if (score < qs.length) {
            const again = document.createElement('button');
            again.type = 'button';
            again.className = 'btn quiz-again';
            again.textContent = 'Intentar de nuevo';
            again.onclick = () => mountQuiz(root, qs, opts);
            sc.append(' ', again);
          }
        }
      };
      o.append(b);
    });
    root.append(d);
  });
  root.append(sc);
}
