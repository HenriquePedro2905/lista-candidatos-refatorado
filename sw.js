self.addEventListener('install', event => {
    console.log('Service Worker instalado');
    event.waitUntil(
      caches.open('pwa-cache').then(cache => {
        return cache.addAll([
          '/candidatos.json',
          '/manifest.json',
          '/index.html',
          '/css/style.css',
          '/js/main.js',
          'images/facebook.svg',
          'images/instagram.svg',
          'images/profile.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    if (event.request.destination === 'image') {
      event.respondWith(
        fetch(event.request).catch(() => {
          return caches.match('images/profile.png');
        })
      );
    } else {
      event.respondWith(
        caches.match(event.request).then(response => {
          return response || fetch(event.request);
        })
      );
    }
  });
  
  
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/')
    );
  });