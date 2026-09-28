// Pocket Tools Service Worker for offline asset caching
const CACHE_NAME = "pockettools-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/calculators/gst",
  "/calculators/sip",
  "/calculators/emi",
  "/calculators/epf",
  "/calculators/income-tax",
  "/calculators/compound-interest",
  "/health/bmi",
  "/date-time/pomodoro",
  "/developer-tools/qr-code",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Continue even if some individual assets fail
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch new version in background (Stale-While-Revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      });
    })
  );
});
