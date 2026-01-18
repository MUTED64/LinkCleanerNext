'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const refreshingRef = useRef(false);
  const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let registration: ServiceWorkerRegistration | null = null;

    const registerServiceWorker = async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[PWA] Service Worker registered successfully:', registration.scope);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration?.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                toast.info('发现新版本', {
                  description: '点击更新以获取最新功能',
                  action: {
                    label: '更新',
                    onClick: () => {
                      newWorker.postMessage({ type: 'SKIP_WAITING' });
                      window.location.reload();
                    },
                  },
                  duration: 10000,
                });
              }
            });
          }
        });

        updateIntervalRef.current = setInterval(() => {
          registration?.update();
        }, 60 * 60 * 1000);

      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();

    const handleControllerChange = () => {
      if (!refreshingRef.current) {
        refreshingRef.current = true;
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      if (registration) {
        registration.update();
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;

      toast.info('添加到主屏幕', {
        description: '快速访问链接清洗器',
        action: {
          label: '安装',
          onClick: async () => {
            if (deferredPromptRef.current) {
              deferredPromptRef.current.prompt();
              const { outcome } = await deferredPromptRef.current.userChoice;
              console.log(`[PWA] User response to install prompt: ${outcome}`);
              deferredPromptRef.current = null;
            }
          },
        },
        duration: 15000,
      });
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      toast.success('安装成功', {
        description: '链接清洗器已添加到主屏幕',
      });
      deferredPromptRef.current = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return null;
}
