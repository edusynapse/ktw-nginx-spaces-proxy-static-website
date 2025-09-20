// web/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCKeSXTduJelfddvgiuBhbMjEYW1lyTf70',
  appId: '1:64979320907:web:8c2d4edc678f3a7ee78dce',
  messagingSenderId: '64979320907',
  projectId: 'know-to-win',
  authDomain: 'know-to-win.firebaseapp.com',
  storageBucket: 'know-to-win.firebasestorage.app',
  measurementId: 'G-VQXDNDQG79',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || 'Notification';
  const body  = payload?.notification?.body  || '';
  const data  = payload?.data || {};
  self.registration.showNotification(title, { body, data });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ('focus' in w) return w.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
