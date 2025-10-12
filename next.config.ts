import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  
  // 设置根路径
  basePath: '',
  assetPrefix: '',
  
  // 图像优化配置
  images: {
    unoptimized: true,
  },
  
  // 性能优化
  reactStrictMode: true,
  
  // 编译优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 实验性功能
  experimental: {
    optimizePackageImports: ['lucide-react', 'sonner'],
  },
  
  // 生产环境优化
  poweredByHeader: false,
  
  // 静态导出配置
  trailingSlash: false,
};

export default nextConfig;
