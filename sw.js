self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("estaciones-cache").then(cache => {
            return cache.addAll([
                "index.html",
                "script.js",
                "styles.css",
                "manifest.json",
                "icono.ico",
                "icono.ico"
            ]);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
