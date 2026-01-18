import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { DynamicComponents } from "@/components/dynamic-components";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "链接清洗工具 - URL Cleaner",
  description: "一键还原短链接并清除跟踪参数，保护您的隐私，简化分享链接",
  applicationName: "链接清洗器",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "链接清洗器",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/web-app-manifest-192x192.png", sizes: "192x192" },
    ],
  },
  manifest: "/manifest.json",
  keywords: ["URL", "链接清洗", "短链接", "隐私保护", "跟踪参数清除", "Link Cleaner"],
  authors: [{ name: "LinkCleaner" }],
  creator: "LinkCleaner",
  openGraph: {
    type: "website",
    siteName: "链接清洗器",
    title: "链接清洗工具 - URL Cleaner",
    description: "一键还原短链接并清除跟踪参数，保护您的隐私，简化分享链接",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <DynamicComponents />
        </ThemeProvider>
      </body>
    </html>
  );
}
