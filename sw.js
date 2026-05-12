const CACHE_NAME = 'bakareng-v-terbaru'; // Gembok versi baru

// 1. Install: Paksa Service Worker baru langsung aktif!
self.addEventListener('install', (e) => {
  console.log('Service Worker: Terpasang');
  self.skipWaiting(); 
});

// 2. Activate: Hancurkan SEMUA ingatan/cache masa lalu!
self.addEventListener('activate', (e) => {
  console.log('Service Worker: Diaktifkan');
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Menghapus Cache Hantu Lama ->', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch: Selalu ambil data segar dari internet Vercel
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});