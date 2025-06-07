import { API_CONFIG, type ApiResponse } from './config';
import { cleanUrl } from './url-cleaner/cleaner';

/**
 * 调用后端API来展开短链接
 */
export async function expandUrl(url: string): Promise<ApiResponse> {
  const apiUrl = API_CONFIG.getApiUrl(url);
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // 对展开的URL进行清洗
  if (data.expanded) {
    try {
      const cleanedUrl = await cleanUrl(data.expanded);
      data.expanded = cleanedUrl;
    } catch (error) {
      console.warn('URL清洗失败，使用原始展开的URL:', error);
    }
  }
  
  return data as ApiResponse;
}

/**
 * 批量处理多个URL
 */
export async function expandUrls(urls: string[]): Promise<Array<{ 
  original: string; 
  result: ApiResponse | null; 
  error: string | null 
}>> {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const result = await expandUrl(url);
        return { original: url, result, error: null };
      } catch (error) {
        return { 
          original: url, 
          result: null, 
          error: error instanceof Error ? error.message : '未知错误' 
        };
      }
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        original: urls[index],
        result: null,
        error: result.reason instanceof Error ? result.reason.message : '处理失败'
      };
    }
  });
}
