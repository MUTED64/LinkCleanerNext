# 链接清洗工具 (URL Cleaner)

一个基于Next.js和shadcn/ui的美观单页应用，用于还原短链接并清理跟踪参数。

## 功能特点

- 🔗 **智能链接识别**: 自动识别文本中的HTTP/HTTPS链接
- 🚀 **批量处理**: 支持同时处理多个短链接
- 🧹 **自动清洗**: 清除UTM、社交媒体等跟踪参数
- 📋 **一键操作**: 支持粘贴、复制和自动复制到剪贴板
- 🎨 **美观界面**: 基于shadcn/ui的现代化设计
- ⚙️ **可配置**: 支持自定义后端API域名

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 配置环境变量

复制 `.env.example` 到 `.env.local` 并配置你的后端API域名：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
NEXT_PUBLIC_API_DOMAIN=your-worker.your-subdomain.workers.dev
```

### 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 后端API

后端API需要支持以下格式：

### 请求格式

```http
GET https://your-worker.your-subdomain.workers.dev/?url=https://bit.ly/example
```

### 响应格式

```json
{
  "original": "https://bit.ly/example",
  "expanded": "https://www.example.com/full-url",
  "redirectChain": [
    "https://bit.ly/example", 
    "https://www.example.com/full-url"
  ],
  "redirectCount": 1,
  "title": "Example Page Title",
  "timestamp": "2025-06-07T10:30:00.000Z"
}
```

## URL清洗规则

清洗规则文件位于 `src/lib/url-cleaner/` 目录下：

- `rules.js` - 主要的清洗规则数组
- `match-factory.js` - 匹配工厂函数（需要你自行添加）
- `clean-factory.js` - 清洗工厂函数（需要你自行添加）

### 添加清洗规则

将你的清洗规则代码粘贴到对应文件中：

1. 将 `match-factory.js` 内容粘贴到 `src/lib/url-cleaner/match-factory.js`
2. 将 `clean-factory.js` 内容粘贴到 `src/lib/url-cleaner/clean-factory.js`
3. 将规则数组粘贴到 `src/lib/url-cleaner/rules.js`

## 使用方法

1. **粘贴内容**: 点击"粘贴"按钮或手动输入包含短链接的文本
2. **处理链接**: 点击"处理链接"按钮开始处理
3. **查看结果**: 处理后的内容会显示在输出区域
4. **自动复制**: 处理完成后会自动复制到剪贴板
