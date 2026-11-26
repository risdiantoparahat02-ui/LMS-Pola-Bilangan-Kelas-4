/* Service Worker — LMS Pola Bilangan (installable + offline) */
const CACHE = 'pola-bilangan-pwa-v3';
const CORE = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url; try { url = new URL(req.url); } catch (_) { return; }
  // Jangan cache layanan luar (video, Drive, Apps Script) — biarkan langsung ke jaringan
  if (/youtube|ytimg|drive\.google|script\.google|googleusercontent|gstatic|fonts\.g/.test(url.host)) return;
  // Navigasi halaman: utamakan jaringan, jika gagal pakai cache (agar bisa luring)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; })
                .catch(() => caches.match('./index.html').then(m => m || caches.match('./')))
    );
    return;
  }
  // Aset: utamakan cache, lalu jaringan
  e.respondWith(
    caches.match(req).then(m => m || fetch(req).then(r => {
      if (r && r.ok && url.origin === location.origin) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return r;
    }).catch(() => m))
  );
});
