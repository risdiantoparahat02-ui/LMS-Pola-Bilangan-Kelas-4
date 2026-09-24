/* Service Worker — LMS Pola Bilangan (agar bisa dibuka luring/offline) */
const CACHE = 'pola-bilangan-v2';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

// Pasang: simpan berkas inti ke cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

// Aktif: bersihkan cache versi lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // kiriman POST (ke Apps Script) langsung ke jaringan
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.host);
  // Jangan tangani YouTube / Drive / Apps Script — biarkan langsung ke jaringan
  if (/youtube|ytimg|drive\.google|script\.google|googleusercontent|googlevideo/.test(url.host)) return;

  // Navigasi halaman: coba jaringan (agar dapat versi terbaru), gagal → pakai cache
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((r) => {
        const cp = r.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', cp));
        return r;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Berkas milik sendiri atau font Google: pakai cache dulu, lalu jaringan (dan simpan)
  if (sameOrigin || isFont) {
    e.respondWith(
      caches.match(req).then((cached) =>
        cached || fetch(req).then((r) => {
          if (r && r.status === 200) {
            const cp = r.clone();
            caches.open(CACHE).then((c) => c.put(req, cp));
          }
          return r;
        }).catch(() => cached)
      )
    );
  }
});
