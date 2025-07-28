self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("study-planner-cache").then(cache => {
      return cache.addAll([
        "/",
        "index.html",
        "style.css",
        "script.js",
        "manifest.json",
        "icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
