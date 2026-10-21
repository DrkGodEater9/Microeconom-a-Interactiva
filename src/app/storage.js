/** Acceso a localStorage tolerante a fallos (modo privado, cuotas, bloqueos). */
export function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* sin almacenamiento: se ignora */
  }
}
