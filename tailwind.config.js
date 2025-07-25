/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // 中文字体 - 斗鱼追光体2.0
        chinese: ['DouYu ZhuiGuang', 'Microsoft YaHei', '微软雅黑', 'SimSun', '宋体', 'sans-serif'],
        // 英文字体 - Roboto
        english: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        // 混合字体 - 中英文混排
        mixed: [
          'DouYu ZhuiGuang',
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Microsoft YaHei',
          '微软雅黑',
          'SimSun',
          '宋体',
          'sans-serif',
        ],
        // 默认字体
        sans: [
          'DouYu ZhuiGuang',
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
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
