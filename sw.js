// 주니퍼 실용음악학원 - 예약 알림용 서비스 워커
// 반드시 index.html과 같은 위치(같은 폴더)에 올려주세요.

self.addEventListener('install', function(event){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event){
  let data = {};
  try{ data = event.data ? event.data.json() : {}; }catch(e){ data = { title: '주니퍼 실용음악학원', body: event.data ? event.data.text() : '' }; }

  const title = data.title || '주니퍼 실용음악학원';
  const options = {
    body: data.body || '',
    data: { url: data.url || './' },
    vibrate: [100, 50, 100]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList){
      for (const client of clientList){
        if('focus' in client) return client.focus();
      }
      if(clients.openWindow) return clients.openWindow(url);
    })
  );
});
