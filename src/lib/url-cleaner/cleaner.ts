import rules from './rules.js';

/**
 * 清洗单个URL - 基础版本
 * 这个版本只做基础的UTM参数清理
 * 完整的清洗规则需要后端处理
 * @param {string} urlString - 要清洗的URL字符串
 * @returns {Promise<string>} 清洗后的URL字符串
 */
export async function cleanUrl(urlString: string): Promise<string> {
  try {
    const url = new URL(urlString);
    
    for (const rule of rules) {
      if (rule.match(url)) {
        const cleaned = await rule.clean(url);
        if (cleaned && cleaned !== url) {
          return cleaned.toString();
        }
      }
    }
    
    return url.toString();
  } catch (error) {
    console.error('URL清洗失败:', error);
    return urlString; // 返回原始URL
  }
}

/**
 * 批量清洗URLs
 * @param {string[]} urls - 要清洗的URL数组
 * @returns {Promise<Array<{original: string, cleaned: string}>>}
 */
export async function cleanUrls(urls: string[]): Promise<Array<{original: string, cleaned: string}>> {
  const results = [];
  
  for (const url of urls) {
    try {
      const cleaned = await cleanUrl(url);
      results.push({
        original: url,
        cleaned: cleaned
      });
    } catch (error) {
      console.error(`清洗URL ${url} 失败:`, error);
      results.push({
        original: url,
        cleaned: url
      });
    }
  }
  
  return results;
}
