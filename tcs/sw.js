const CACHE_NAME = 'tcs2-admin-v1';
const APP_SHELL = [
    'login.html',
    'dashboard.html',
    'employees.html',
    'objects.html',
    'sessions.html',
    'payments.html',
    'references.html',
    'employee-groups.html',
    'users.html',
    'style.css',
    'app.js',
    'i18n.js',
    'manifest.json',
    'icon-admin.svg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        ))
    );
    self.clients.claim();
});

// Incoming Web Push message — payload is whatever push-service was asked
// to encrypt (see TCS2 - Send Admin Push Notification): { title, body, url }.
self.addEventListener('push', (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        data = { title: 'TCS2 Admin', body: event.data ? event.data.text() : '' };
    }

    const title = data.title || 'TCS2 Admin';
    const options = {
        body: data.body || '',
        icon: 'icon-admin.svg',
        badge: 'icon-admin.svg',
        data: { url: data.url || 'dashboard.html' },
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) || 'dashboard.html';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
            for (const client of clientsList) {
                if (client.url.indexOf(targetUrl) !== -1 && 'focus' in client) return client.focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
        })
    );
});

// Same-origin GET requests only — cross-origin API calls to n8n.vseproi.de
// pass straight through untouched.
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin || event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            const networkFetch = fetch(event.request)
                .then((response) => {
                    if (response && response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || networkFetch;
        })
    );
});
