import { useState, useEffect } from 'react';
import { showToast } from '../utils/toast';

/**
 * Hook for detecting online/offline status
 * Returns: { isOnline, isOffline }
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast.success('🌐 Jste online!', {
        duration: 2000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast.info('📡 Jste offline - používáte cached data', {
        duration: 3000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
  };
};

/**
 * Hook for PWA install prompt
 * Returns: { isInstallable, isInstalled, promptInstall }
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent default browser prompt
      e.preventDefault();
      // Store event for later use
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      showToast.success('🎉 StudyPro nainstalováno!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return false;
    }

    // Show install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      showToast.success('Instalace zahájena...');
    }

    // Clear prompt
    setDeferredPrompt(null);

    return outcome === 'accepted';
  };

  return {
    isInstallable: !!deferredPrompt && !isInstalled,
    isInstalled,
    promptInstall,
  };
};

/**
 * Hook for Service Worker status
 * Returns: { isServiceWorkerReady, serviceWorkerStatus, updateServiceWorker, clearCache }
 */
export const useServiceWorker = () => {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setStatus('not-supported');
      return;
    }

    navigator.serviceWorker.ready.then(() => {
      setIsReady(true);
      setStatus('ready');
    });

    const handleControllerChange = () => {
      setStatus('updated');
      showToast.info('Nová verze dostupná - obnovte stránku', {
        duration: 5000,
      });
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const updateServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      showToast.success('Kontrola aktualizací...');
    }
  };

  const clearCache = async () => {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.active) {
      // Send message to SW to clear cache
      registration.active.postMessage({ type: 'CLEAR_CACHE' });
      showToast.success('Cache vymazána!');
    }
  };

  return {
    isServiceWorkerReady: isReady,
    serviceWorkerStatus: status,
    updateServiceWorker,
    clearCache,
  };
};
