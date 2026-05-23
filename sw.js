// Service Worker for PWA
const CACHE_NAME = 'kakeibo-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => 
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Google API系はキャッシュしない（常に最新を取得）
  if (event.request.url.includes('googleapis.com') || 
      event.request.url.includes('accounts.google.com') ||
      event.request.url.includes('gstatic.com')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => 
      response || fetch(event.request).catch(() => caches.match('./'))
    )
  );
});
