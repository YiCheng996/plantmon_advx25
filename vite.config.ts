import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 代理API请求以解决CORS问题
      '/api/plantmon': {
        target: 'https://plantmonapi.zeabur.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/plantmon/, ''),
        secure: true,
        headers: {
          // 添加必要的请求头
          'User-Agent': 'PlantMon-Frontend/1.0',
        },
        configure: (proxy) => {
          proxy.on('error', (err, req) => {
            console.log('代理错误:', err)
            console.log('请求URL:', req.url)
          })
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('发送请求:', req.method, req.url, '-> 目标:', proxyReq.path)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('收到响应:', proxyRes.statusCode, req.url)
          })
        },
      },
    },
  },
})
