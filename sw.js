const CACHE_NAME = 'bakareng-pwa-v6-network-first'; // Gembok v6 biar HP langsung sadar!

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/serdam.html',
  '/tani.html',
  '/suwignyo.html',
  '/manifest.json',
  '/logo.png'
];

// 1. Install: Paksa Service Worker baru langsung aktif
self.addEventListener('install', (e) => {
  console.log('Service Worker: Mewah Installed');
  self.skipWaiting();
});

// 2. Activate: Hancurkan semua cache masa lalu
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

// 3. Fetch: STRATEGI NETWORK FIRST (Ini perbaikan utamanya!)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    // Coba ambil dari internet (Vercel/GitHub) dulu
    fetch(e.request)
      .then((response) => {
        // Kalau berhasil dapet dari internet, simpan/perbarui ke dalam Cache HP
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return response; // Tampilkan kodingan paling baru
      })
      .catch(() => {
        // KALAU HP SEDANG OFFLINE (Tidak ada kuota/sinyal), baru panggil dari Cache
        return caches.match(e.request);
      })
  );
});