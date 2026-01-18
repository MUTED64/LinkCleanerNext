'use client';

import { useEffect } from 'react';

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    const observers: PerformanceObserver[] = [];
    let clsScore = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('[Performance] Page hidden');
      } else {
        console.log('[Performance] Page visible');
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (perfData) {
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          request: perfData.responseEnd - perfData.requestStart,
          domParse: perfData.domInteractive - perfData.responseEnd,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          total: perfData.loadEventEnd - perfData.fetchStart,
        };

        console.log('[Performance] Page metrics:', metrics);
      }

      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('[Performance] LCP:', lastEntry.startTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          observers.push(lcpObserver);

          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const fidEntry = entry as PerformanceEventTiming;
              console.log('[Performance] FID:', fidEntry.processingStart - fidEntry.startTime);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
          observers.push(fidObserver);

          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const clsEntry = entry as LayoutShiftEntry;
              if (!clsEntry.hadRecentInput) {
                clsScore += clsEntry.value;
                console.log('[Performance] CLS:', clsScore);
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
          observers.push(clsObserver);
        } catch {
          console.warn('[Performance] PerformanceObserver not fully supported');
        }
      }
    });

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 1000) {
            console.warn('[Performance] Slow resource:', entry.name, `${entry.duration}ms`);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      observers.push(resourceObserver);
    } catch {
    }

    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('[Performance] Long task detected:', entry.duration);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      observers.push(longTaskObserver);
    } catch {
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
