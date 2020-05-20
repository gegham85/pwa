const staticAssets = [
    './',
    './hello-world.css',
    './app.js'
];

self.addEventListener('install', async event => {
    // const cache = await cache.open('new-static');
    // cache.addAll(staticAssets);
    event.waitUntil(
        caches.open('new-static').then(function(cache) {
            return cache.addAll(staticAssets);
        })
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.origin) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('news-dynamic');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (e) {
        return await cache.match(req);
    }
}