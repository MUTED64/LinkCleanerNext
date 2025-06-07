// API配置
export const API_CONFIG = {
  // 可配置的后端域名
  domain: process.env.NEXT_PUBLIC_API_DOMAIN || 'your-worker.your-subdomain.workers.dev',
  
  // 获取完整的API URL
  getApiUrl: (url: string) => {
    const encodedUrl = encodeURIComponent(url);
    return `https://${API_CONFIG.domain}/?url=${encodedUrl}`;
  }
};

// API响应类型定义
export interface ApiResponse {
  original: string;
  expanded: string;
  redirectChain: string[];
  redirectCount: number;
  title: string;
  timestamp: string;
}
