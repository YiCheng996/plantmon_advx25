/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // 普通文字 - 阿里巴巴普惠体
        body: [
          'Alibaba PuHuiTi',
          'PingFang SC',
          'Microsoft YaHei',
          '微软雅黑',
          'SimSun',
          '宋体',
          'sans-serif',
        ],
        // 标题文字 - 造字工房映力黑规体
        title: [
          '造字工房映力黑规体',
          'Alibaba PuHuiTi',
          'PingFang SC',
          'Microsoft YaHei',
          '微软雅黑',
          'sans-serif',
        ],
        // 中文字体 - 阿里巴巴普惠体（保持向后兼容）
        chinese: [
          'Alibaba PuHuiTi',
          'PingFang SC',
          'Microsoft YaHei',
          '微软雅黑',
          'SimSun',
          '宋体',
          'sans-serif',
        ],
        // 英文字体 - 阿里巴巴普惠体西文
        english: [
          'Alibaba Sans',
          'Alibaba PuHuiTi',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        // 混合字体 - 中英文混排
        mixed: [
          'Alibaba PuHuiTi',
          'Alibaba Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Microsoft YaHei',
          '微软雅黑',
          'SimSun',
          '宋体',
          'sans-serif',
        ],
        // 默认字体
        sans: [
          'Alibaba PuHuiTi',
          'Alibaba Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Microsoft YaHei',
          '微软雅黑',
          'SimSun',
          '宋体',
          'sans-serif',
        ],
      },
      // 字体权重
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [],
}
