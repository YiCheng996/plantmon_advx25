import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/contexts/GameContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plantmon - 植宠收集对战游戏",
  description: "一款结合AI图像识别的轻度宠物收集与对战游戏",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Plantmon",
  },
  formatDetection: {
    telephone: false,
  },
};

// 移动端视窗配置
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // 支持iPhone刘海屏
  themeColor: "#10b981", // 与主题色保持一致
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        {/* PWA相关meta标签 */}
        <meta name="application-name" content="Plantmon" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Plantmon" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#10b981" />
        
        {/* 防止iOS Safari缩放 */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* 摄像头权限相关 */}
        <meta name="camera" content="camera" />
        
        {/* 强制移动端布局 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* 防止页面缓存问题 */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* 优化触摸延迟 */}
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* 预加载关键资源 */}
        <link rel="preload" href="/assets/scenes/背景.png" as="image" />
        
        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
