// API配置文件
export const API_CONFIG = {
  // 基础API地址，开发环境使用代理，生产环境使用直接URL
  BASE_URL: import.meta.env.DEV
    ? '/api/plantmon' // 开发环境使用代理路径
    : import.meta.env.VITE_API_BASE_URL || 'https://plantmonapi.zeabur.app',

  // API端点
  ENDPOINTS: {
    HEALTH: '/health',
    PLANTS: '/plants',
    PLANT_DETAIL: '/plants', // 需要拼接植物拉丁名
    PROCESS: '/process',
  },

  // 请求超时时间（毫秒）
  TIMEOUT: 30000,

  // 默认请求头
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
}

// 环境变量类型定义
declare global {
  interface ImportMetaEnv {
    VITE_API_BASE_URL?: string
  }
}
