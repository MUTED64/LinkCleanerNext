// URL相关的工具函数

/**
 * 从文本中提取所有URL
 * 支持http、https协议的URL
 */
export function extractUrls(text: string): Array<{ url: string; start: number; end: number }> {
  // 匹配URL的正则表达式
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    urls.push({
      url: match[0],
      start: match.index,
      end: match.index + match[0].length
    });
  }

  return urls;
}

/**
 * 替换文本中的URL
 */
export function replaceUrlsInText(
  text: string,
  urlReplacements: Array<{ original: string; replacement: string }>
): string {
  let result = text;
  
  // 按照位置倒序替换，避免位置偏移问题
  const urls = extractUrls(text);
  
  for (let i = urls.length - 1; i >= 0; i--) {
    const { url, start, end } = urls[i];
    const replacement = urlReplacements.find(r => r.original === url);
    
    if (replacement) {
      result = result.substring(0, start) + replacement.replacement + result.substring(end);
    }
  }
  
  return result;
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } catch (err) {
        console.error('复制失败:', err);
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
}

/**
 * 从剪贴板读取文本
 */
export async function readFromClipboard(): Promise<string> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    } else {
      // 对于不支持clipboard API的情况，返回空字符串
      return '';
    }
  } catch (err) {
    console.error('读取剪贴板失败:', err);
    return '';
  }
}
