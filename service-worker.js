const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    './index.html',
    './',
    'https://fonts.googleapis.com/css2?family=Russo+One&display=swap'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Install event');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        }).catch((err) => {
            console.error('Failed to cache:', err);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activate event');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('message', (event) => {
    console.log('Service Worker: Received message:', event.data);
    if (event.data && event.data.type === 'SAVE_GAME_STATE') {
        saveGameState(event.data.game);
    } else if (event.data && event.data.type === 'GET_GAME_HISTORY') {
        event.ports[0].postMessage(gameHistory);
    }
});

let gameHistory = [];

function saveGameState(game) {
    gameHistory.push(game);
    console.log('Game state saved:', game);
}