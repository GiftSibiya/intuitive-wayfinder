const CACHE_NAME = "offline-offline-app-v1";
const ASSETS = [
    "/",
    "/index.html",
    "/src/css/styles.css",
    "/src/js/app.js",
    "/src/js/service-worker.js",
    "/src/components/PortraitWayfinder.js",
];

// Install Service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

// Fetch from cache when offline
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
