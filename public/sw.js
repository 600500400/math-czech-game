// Kill-switch service worker.
// Replaces the previous Procvička app-shell SW so returning browsers
// evict the stale registration and stop loading deleted JS chunks.

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const ours = cacheNames.filter((n) =>
          /^procvicka-(static|dynamic|images)-v/.test(n) ||
          /^math-czech-practice-v/.test(n)
        );
        await Promise.allSettled(ours.map((n) => caches.delete(n)));
        await self.clients.claim();
        const windowClients = await self.clients.matchAll({ type: "window" });
        await Promise.allSettled(
          windowClients.map((c) => c.navigate(c.url))
        );
      } finally {
        await self.registration.unregister();
      }
    })()
  )
);

// Pass-through fetch — never serve cached chunks.
self.addEventListener("fetch", () => {});
