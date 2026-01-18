'use client';

import dynamic from 'next/dynamic';

const PWAInstaller = dynamic(
  () => import('@/components/pwa-installer').then(mod => mod.PWAInstaller),
  { ssr: false }
);

const PerformanceMonitor = dynamic(
  () => import('@/components/performance-monitor').then(mod => mod.PerformanceMonitor),
  { ssr: false }
);

export function DynamicComponents() {
  return (
    <>
      <PWAInstaller />
      <PerformanceMonitor />
    </>
  );
}
