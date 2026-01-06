const CACHE = "pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/app.js",
  "/icon-192.png",
  "/icon-512.png"
];

// INSTALL: cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(clients.claim());
});

// FETCH: serve cached files when offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// MESSAGE from page
self.addEventListener("message", async event => {
  if (event.data === "CHECK_REMINDERS") {
    // Forward message to all clients (pages)
    const allClients = await clients.matchAll({ includeUncontrolled: true });
    allClients.forEach(client => {
      client.postMessage("CHECK_REMINDERS");
    });
  }
});
