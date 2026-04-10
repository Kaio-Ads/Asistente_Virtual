const CACHE_NAME = 'asistente-mario-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/Asistente_Virtual/'));
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleNotifications(e.data.rutina);
  }
});

function scheduleNotifications(rutina) {
  const ahora = new Date();
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

  rutina.forEach(item => {
    const partes = String(item.hora).split(':');
    if (partes.length < 2) return;
    const minutos = parseInt(partes[0]) * 60 + parseInt(partes[1]);
    const diff = (minutos - horaActual) * 60 * 1000;

    if (diff > 0) {
      setTimeout(() => {
        self.registration.showNotification('Asistente Mario', {
          body: `${item.hora} — ${item.actividad}`,
          icon: 'https://via.placeholder.com/192x192/1D9E75/ffffff?text=AM',
          badge: 'https://via.placeholder.com/72x72/1D9E75/ffffff?text=AM',
          vibrate: [200, 100, 200],
          tag: `rutina-${item.hora}`,
          renotify: true
        });
      }, diff);
    }
  });
}
