const CACHE = 'lifegame-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/tokens.css',
  '/css/base.css',
  '/css/typography.css',
  '/css/chat.css',
  '/css/cards.css',
  '/css/components.css',
  '/css/forms.css',
  '/css/feedback.css',
  '/css/mobile.css',
  '/js/utils.js',
  '/js/state.js',
  '/js/api.js',
  '/js/router.js',
  '/js/chat.js',
  '/js/quests.js',
  '/js/checkin.js',
  '/js/dashboard.js',
  '/js/community.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Never cache API proxy calls
  if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache-first for all app assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
