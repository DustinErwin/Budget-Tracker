const FILES_TO_CACHE = [];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => {
        console.log("Cache Opened");
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(self.skipWaiting())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(RUNTIME).then((cache) => {
        return fetch(event.request).then((response) => {
          let responseToCache = response.clone();
          return cache.put(event.request, responseToCache).then(() => {
            return response;
          });
        });
      });
    })
  );
});
