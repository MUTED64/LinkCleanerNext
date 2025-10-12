'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function PWAInstaller() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // 注册 Service Worker
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          console.log('[PWA] Service Worker registered successfully:', registration.scope);

          // 检查更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 新版本可用
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

          // 定期检查更新
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // 每小时检查一次

        } catch (error) {
          console.error('[PWA] Service Worker registration failed:', error);
        }
      };

      registerServiceWorker();

      // 监听 Service Worker 控制器变化
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // 监听安装提示
  useEffect(() => {
    let deferredPrompt: any = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // 显示安装提示
      toast.info('添加到主屏幕', {
        description: '快速访问链接清洗器',
        action: {
          label: '安装',
          onClick: async () => {
            if (deferredPrompt) {
              deferredPrompt.prompt();
              const { outcome } = await deferredPrompt.userChoice;
              console.log(`[PWA] User response to install prompt: ${outcome}`);
              deferredPrompt = null;
            }
          },
        },
        duration: 15000,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 监听应用安装成功
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      toast.success('安装成功', {
        description: '链接清洗器已添加到主屏幕',
      });
      deferredPrompt = null;
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}
