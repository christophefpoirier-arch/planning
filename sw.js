// Service Worker — Planning Hebdomadaire
// Gère les notifications push en arrière-plan

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Réception d'un message depuis la page principale
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'PLANIFIER_ALERTE'){
    planifierProchaine15h(e.data.taches, e.data.jour);
  }
});

// Réception d'une notification push
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window'}).then(list => {
      if(list.length > 0) return list[0].focus();
      return clients.openWindow('/planning/');
    })
  );
});

// Affichage de la notification
function afficherNotification(titre, corps){
  self.registration.showNotification(titre, {
    body: corps,
    icon: 'https://christophefpoirier-arch.github.io/planning/icon.png',
    badge: 'https://christophefpoirier-arch.github.io/planning/icon.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    tag: 'planning-15h'
  });
}

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  afficherNotification(data.titre || '⏰ Planning 15h', data.corps || 'Vérifiez vos tâches du jour.');
});
