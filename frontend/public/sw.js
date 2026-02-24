self.addEventListener('push', function (event) {
    const data = event.data.json();
    console.log('Push Received:', data);

    const title = data.title || 'TheDevilPlayz';
    const options = {
        body: data.body,
        icon: '/logo192.png', // Ensure this exists or use a default
        badge: '/logo192.png',
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
