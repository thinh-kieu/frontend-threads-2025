const handleDumiBasePath = () => {
  // Detect Service Worker URL based on pathname
  // If pathname has /frontend-threads-2025/ then use full path
  const hasBasePath = window.location.pathname.startsWith(
    '/frontend-threads-2025/',
  );
  const serviceWorkerUrl = hasBasePath
    ? '/frontend-threads-2025/mockServiceWorker.js'
    : '/mockServiceWorker.js';

  return serviceWorkerUrl;
};

export const setupApiMocks = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  const { setupWorker } = await import('msw/browser');
  const { authHandlers } = await import('../app/auth/apis/mocks');

  const worker = setupWorker(...authHandlers);

  const serviceWorkerUrl = handleDumiBasePath();

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: serviceWorkerUrl,
    },
  });

  return worker;
};
