import type { MetadataRoute } from 'next'
 
export const dynamic = "force-static";
export const revalidate = 86400;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '链接清洗器',
    short_name: 'LinkCleaner',
    description: '一键还原短链接并清除跟踪参数，保护您的隐私，简化分享链接',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    categories: ['utilities', 'productivity'],
  }
}