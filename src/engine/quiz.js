/** Cuestionario de opción múltiple con explicación por respuesta. */
/* ---------- mini quiz ---------- */
export function mountQuiz(root, qs) {
  let score = 0,
    done = 0;
  root.className = 'quiz';
  const sc = document.createElement('div');
  sc.style.cssText = 'font-family:var(--ui);font-size:15px;color:var(--muted)';
  sc.textContent = `Aciertos: 0 de ${qs.length}`;
  qs.forEach((q, qi) => {
    const d = document.createElement('div');
    d.className = 'q';
    d.innerHTML = `<p class="qq">${qi + 1}. ${q.q}</p><div class="opts"></div><div class="why"></div>`;
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
        if (i === q.a) {
          score++;
        } else b.classList.add('bad');
        d.querySelector('.why').innerHTML =
          (i === q.a
            ? '<b style="color:var(--green)">¡Correcto!</b> '
            : '<b style="color:var(--red)">No exactamente.</b> ') + q.why;
        sc.textContent =
          `Aciertos: ${score} de ${qs.length}` +
          (done === qs.length
            ? score === qs.length
              ? ' — ¡perfecto!'
              : ' — repasa las explicaciones y vuelve a intentarlo recargando.'
            : '');
      };
      o.append(b);
    });
    root.append(d);
  });
  root.append(sc);
}
