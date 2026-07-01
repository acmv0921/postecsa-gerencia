// POSTECSA Gerencia — Service Worker
const CACHE_NAME = 'postecsa-gerencia-v2-1782865836';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(['/postecsa-gerencia/app.html', '/postecsa-gerencia/manifest.json']))
      .catch(err => console.warn('[SW] Cache parcial:', err))
  );
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
