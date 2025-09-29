const CACHE_NAME = 'pwa-mana-cache-v1';
const urlsToCache = [
  // 1. Path Root ของ PWA (สำคัญมากสำหรับ Scope)
  '/my-simple-pwa/', 
  // 2. ไฟล์อื่นๆ
  '/my-simple-pwa/index.html',
  '/my-simple-pwa/manifest.json',
  '/my-simple-pwa/service-worker.js',
  '/my-simple-pwa/images/icon-192x192.png',
  '/my-simple-pwa/images/icon-512x512.png'
];

// ติดตั้ง Service Worker และแคชไฟล์
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// ดึงข้อมูลจาก Cache ก่อน ถ้ามี ถ้าไม่มีค่อยไปเอาจาก Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ถ้ามีในแคช ก็ใช้เลย
        if (response) {
          return response;
        }
        // ถ้าไม่มี ก็ไปเอาจาก Network
        return fetch(event.request);
      })
  );
});

// ลบแคชเก่า (ถ้ามีการอัปเดตเวอร์ชัน cache)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

});
