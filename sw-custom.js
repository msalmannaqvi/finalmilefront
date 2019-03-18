(function () {
  'use strict';

  self.addEventListener('push', (e) => {
    var notification = e.notification;
    let data = e['data'].json();
    console.log('Event.....', e);
    // activationAlert(e, notification);
    e.waitUntil(
      self.registration.showNotification(data['notification']['title'], {
        body: data['notification']['body'],
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
        },
        actions: [{
          action: 'openapp',
          title: 'Open App'
        }],
      }).then(() => {
        self.clients.matchAll().then(all => all.map(client => client.postMessage(data)));
      })
    )
  });

  self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    console.log("Into Notification Click....");

    activationAlert(e, notification);

  });
}());

function activationAlert(e, notification) {
  e.waitUntil(clients.matchAll().then(function (clis) {
    console.log('clis....', clis);
    var client = clis.find(function (c) {
      return c.visibilityState === 'visible' ? c : undefined;
    });
    console.log('Client...', client);
    if (client !== undefined) {
      console.log('if');
      client.navigate('/communication/notifications');
      client.focus();
    } else {
      console.log('else');
      clients.openWindow('/');
      notification.close();
    }
  }));
}