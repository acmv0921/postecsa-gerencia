// POSTECSA Gerencia - Service Worker "red primero" (permite instalar la app y abrir sin conexion)
const CACHE_NAME = 'postecsa-gerencia-v3';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;   // GAS, CDN: directo a la red
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(ch => ch.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request).then(m => m || new Response('Sin conexion', {status: 503})))
  );
});
