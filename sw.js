const CACHE_NAME = "zaq_myapp_v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./about.html",
  "./contact.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./images/icons/web-app-manifest-192x192.png",
  "./images/icons/web-app-manifest-512x512.png",
  "./offline-message.json",
];

// Install event
self.addEventListener("install", (event) => {
  console.log("Installing Service Worker...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Activating Service Worker...");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.hostname === "jsonplaceholder.typicode.com") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log("[SW] Serving API from cache:", event.request.url);
          return cachedResponse;
        }
        return fetch(event.request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
            return response;
          })
          .catch(() => {
            return caches.match("./offline-message.json");
          });
      })
    );
    return;
  }

  // Static asset fallback
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return new Response("You are offline.");
        })
      );
    })
  );
});
