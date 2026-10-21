/* Service worker: la guía funciona sin conexión.
   Navegación: red primero, con la copia guardada como respaldo.
   Archivos con hash (/assets/): caché primero. Resto del mismo origen: caché y actualización. */
const CACHE = 'micro-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(['./', './manifest.webmanifest', './icon.svg']))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const save = (response) => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  };
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(save)
        .catch(() => caches.match(request).then((hit) => hit || caches.match('./'))),
    );
    return;
  }
  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then(save)));
    return;
  }
  event.respondWith(
    caches.match(request).then((hit) => {
      const fresh = fetch(request)
        .then(save)
        .catch(() => hit);
      return hit || fresh;
    }),
  );
});
