// Check if service workers are supported
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
  }

const publicVapidKey = 'BB-Kjl-cw8II5qoFYtBRgiKzNE9Gs_rDuNKkAU2d_gULWX7upl5a9UETUK7k3Y3Jh2ZESO9OZYGKKavUDxy0Sv4';

// Copied from the web-push documentation
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// The subscribe function will be called when the user clicks the subscribe button.
window.subscribe = async () => {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  // On the backend we'll create a new endpoint for receiving a subscription object and saving it to the database.
  // On the client, we need to use this endpoint and send the subscription to the backend.
  console.log(subscription);
  await fetch('/subscription', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });
};