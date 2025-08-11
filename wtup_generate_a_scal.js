class Notifier {
  constructor(deviceToken, notificationHub) {
    this.deviceToken = deviceToken;
    this.notificationHub = notificationHub;
  }

  sendNotification(title, message) {
    const notification = {
      title,
      message,
      deviceToken: this.deviceToken,
    };

    return fetch(this.notificationHub, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    })
      .then((response) => response.json())
      .then((data) => console.log(`Notification sent: ${data.result}`))
      .catch((error) => console.error(`Error sending notification: ${error}`));
  }
}

// Test case
const deviceToken = '1234567890abcdef';
const notificationHub = 'https://example.com/notification_hub';

const notifier = new Notifier(deviceToken, notificationHub);

notifier.sendNotification('Test Notification', 'This is a test message');

// Scalability feature: send notifications in batches
const batchNotifier = (notifications) => {
  const batchSize = 10;
  const batches = [];

  for (let i = 0; i < notifications.length; i += batchSize) {
    const batch = notifications.slice(i, i + batchSize);
    batches.push(batch);
  }

  batches.forEach((batch) => {
    const notificationBatch = batch.map((notification) => ({
      title: notification.title,
      message: notification.message,
      deviceToken: notification.deviceToken,
    }));

    fetch(notificationHub, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationBatch),
    })
      .then((response) => response.json())
      .then((data) => console.log(`Batch notification sent: ${data.result}`))
      .catch((error) => console.error(`Error sending batch notification: ${error}`));
  });
};

const notifications = Array(100).fill(null).map((_, index) => ({
  title: `Test Notification ${index}`,
  message: `This is a test message ${index}`,
  deviceToken: deviceToken,
}));

batchNotifier(notifications);