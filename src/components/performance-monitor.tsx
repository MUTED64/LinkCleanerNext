'use client';

import { useEffect } from 'react';

// 性能相关类型定义
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export function PerformanceMonitor() {
  useEffect(() => {
    // 性能监控
    if (typeof window !== 'undefined' && 'performance' in window) {
      // 监听页面完全加载
      window.addEventListener('load', () => {
        // 获取性能指标
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (perfData) {
          const metrics = {
            // DNS 查询时间
            dns: perfData.domainLookupEnd - perfData.domainLookupStart,
            // TCP 连接时间
            tcp: perfData.connectEnd - perfData.connectStart,
            // 请求响应时间
            request: perfData.responseEnd - perfData.requestStart,
            // DOM 解析时间
            domParse: perfData.domInteractive - perfData.responseEnd,
            // DOM 内容加载完成时间
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            // 页面完全加载时间
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            // 总加载时间
            total: perfData.loadEventEnd - perfData.fetchStart,
          };

          console.log('[Performance] Page metrics:', metrics);
          
          // 可以将性能数据发送到分析服务
          // sendToAnalytics(metrics);
        }

        // Web Vitals
        if ('PerformanceObserver' in window) {
          try {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              console.log('[Performance] LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach((entry) => {
                const fidEntry = entry as PerformanceEventTiming;
                console.log('[Performance] FID:', fidEntry.processingStart - fidEntry.startTime);
              });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsScore = 0;
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
          } catch {
            // Performance Observer 不支持
            console.warn('[Performance] PerformanceObserver not fully supported');
          }
        }
      });

      // 监听资源加载
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // 检查加载时间过长的资源
          if (entry.duration > 1000) {
            console.warn('[Performance] Slow resource:', entry.name, `${entry.duration}ms`);
          }
        }
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch {
        // 不支持
      }

      // 监听长任务
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn('[Performance] Long task detected:', entry.duration);
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch {
        // 不支持 longtask
      }
    }

    // 监听可见性变化
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('[Performance] Page hidden');
      } else {
        console.log('[Performance] Page visible');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
