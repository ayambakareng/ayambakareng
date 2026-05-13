// Ganti CACHE_NAME untuk memaksa browser mengupdate kodingan mewah
const CACHE_NAME = 'bakareng-pwa-v4'; 

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/serdam.html',
  '/tani.html',
  '/suwignyo.html',
  '/manifest.json',
  '/logo.png'
];

self.addEventListener('install', (e) => {
  console.log('Service Worker: Mewah Installed');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Assets Mewah');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker: Mewah Activated');
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Menghapus Cache Lama (Ruqyah) ->', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Prioritaskan ambil dari jaringan, kalau gagal baru dari cache
      return response || fetch(e.request);
    })
  );
});