// Build replaces these markers with a content hash and the complete offline shell.
const BUILD_ID = '__BUILD_ID__';
const PRECACHE = /*__PRECACHE__*/[];
const PREFIX = `happy-class-pwa-${encodeURIComponent(self.registration.scope)}-`;
const CACHE_NAME = PREFIX + BUILD_ID;
const localUrl = path => new URL(path, self.registration.scope).href;
self.addEventListener('install', event => {
  // Do not skipWaiting: keep each open page paired with its own build's assets.
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE.map(localUrl))));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request=event.request;
  if (request.method!=='GET' || !request.url.startsWith(self.registration.scope)) return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    if (request.mode==='navigate') {
      const shell=await cache.match(localUrl('index.html'));
      if (shell) return shell;
      try { return await fetch(request); } catch { return new Response('Ứng dụng chưa sẵn sàng offline. Vui lòng kết nối mạng một lần.',{status:503}); }
    }
    const cached=await cache.match(request);
    if (cached) return cached;
    try { return await fetch(request); } catch { return new Response('',{status:503}); }
  })());
});
