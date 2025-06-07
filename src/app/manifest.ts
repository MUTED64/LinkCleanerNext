import type { MetadataRoute } from 'next'
 
export const dynamic = "force-static";
export const revalidate = 86400;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '链接清洗器',
    short_name: 'LinkCleaner',
    description: '链接清洗器',
    start_url: '/LinkCleanerNext/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: 'web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}