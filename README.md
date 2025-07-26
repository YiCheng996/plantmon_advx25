# 植宠捕获系统 🌱

一个基于Vue 3 + TypeScript + Tailwind CSS构建的现代化植宠捕获与管理系统。

## ✨ 功能特性

- 📸 **智能拍照捕获**: 使用设备摄像头拍摄植物照片
- 🔍 **AI植物识别**: 集成植物识别API，自动识别植物种类
- 📱 **响应式设计**: 完美适配移动端和桌面端
- 🎨 **现代化UI**: 基于Tailwind CSS的精美界面设计
- 🎵 **沉浸式音效**: 支持背景音乐和音效控制
- 📚 **植宠图鉴**: 完整的植宠收藏和详情展示系统
- 🎮 **游戏化体验**: 类似宝可梦的捕获和收集玩法

## 🎨 设计系统

### 字体配置

项目采用现代化的中文字体方案：

- **标题字体**: 造字工房映力黑规体 - 专为标题和重要文字设计的现代黑体
- **正文字体**: 阿里巴巴普惠体 - 阿里巴巴开源的高品质中文字体
- **英文字体**: Alibaba Sans - 阿里巴巴普惠体西文版本

### 字体来源

- 造字工房映力黑规体 - 本地字体文件 (`/造字工房映力黑规体.otf`)
- 阿里巴巴普惠体 - 本地字体文件 (Regular/Medium/SemiBold)
- Alibaba Sans - 本地字体文件 (Light/Regular/Medium/Bold)
- 系统备用字体 - PingFang SC、微软雅黑等

### 字体特性

- 📦 **本地部署**: 所有主要字体文件都存储在本地，无需依赖外部CDN
- ⚡ **快速加载**: 本地字体文件提供更快的加载速度和更稳定的体验
- 🎯 **智能回退**: 如果主字体不可用，自动使用系统字体
- 📱 **跨平台**: 支持Windows、macOS、Android、iOS等平台
- 🎨 **多权重支持**: 提供Light、Regular、Medium、SemiBold、Bold等多种字重
- 🌐 **多语言支持**: 完整的中英文字符集覆盖

## 🛠️ 技术栈

- **前端框架**: Vue 3 (Composition API)
- **类型系统**: TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **路由管理**: Vue Router
- **状态管理**: Pinia
- **HTTP客户端**: Axios
- **测试框架**: Vitest + Playwright

## 📦 安装与运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🎯 使用方法

### Tailwind字体类

```html
<!-- 标题文字 -->
<h1 class="font-title">植宠图鉴</h1>

<!-- 正文内容 -->
<p class="font-body">这是正文内容</p>

<!-- 中文文字 -->
<div class="font-chinese">中文文本</div>

<!-- 英文文字 -->
<div class="font-english">English Text</div>

<!-- 中英文混合文本 -->
<div class="font-mixed">混合文本 Mixed Text</div>

<!-- 默认字体（推荐用于混合内容） -->
<div class="font-sans">默认混合字体 Default Font</div>
```

#### CSS类

```css
.font-title {
  font-family: '造字工房映力黑规体', 'Alibaba PuHuiTi', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.font-body {
  font-family: 'Alibaba PuHuiTi', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.font-chinese {
  font-family: 'Alibaba PuHuiTi', 'PingFang SC', 'Microsoft YaHei', '微软雅黑', sans-serif;
}
.font-english {
  font-family: 'Alibaba Sans', 'Alibaba PuHuiTi', sans-serif;
}
.font-mixed {
  font-family: 'Alibaba PuHuiTi', 'Alibaba Sans', sans-serif;
}
```

### 字体权重

阿里巴巴普惠体支持多种字重：

- `font-weight: 400` (Regular) - 用于正文
- `font-weight: 500` (Medium) - 用于次要标题
- `font-weight: 600` (SemiBold) - 用于重要文本和小标题

Alibaba Sans支持的字重：

- `font-weight: 300` (Light) - 用于辅助文本
- `font-weight: 400` (Regular) - 用于英文正文
- `font-weight: 500` (Medium) - 用于英文次要标题
- `font-weight: 700` (Bold) - 用于英文标题和强调

## 🎵 音频功能

### 背景音乐

- **自动播放**: 进入网页时自动播放`homepage.wav`作为背景音乐
- **循环播放**: 音乐会持续循环播放，营造良好的游戏氛围
- **用户控制**: 右上角音频控制按钮可以暂停/播放音乐
- **音量调节**: 点击音频按钮显示音量滑块，支持0-100%音量调节
- **浏览器适配**: 自动处理浏览器的自动播放限制，显示用户友好的启用提示

### 音频文件

- `public/sound/homepage.wav` - 主页背景音乐
- `public/sound/combat.wav` - 战斗音效（预留）

### 技术特性

- 🔄 **智能重试**: 自动处理音频加载失败和网络问题
- 📱 **移动端优化**: 支持触摸操作和移动端浏览器
- 🎛️ **完整控制**: 播放、暂停、音量控制和状态监控
- 🚫 **自动播放策略**: 遵循浏览器政策，提供用户交互提示

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 文件结构

```
plantmon_advx25/
├── public/                          # 静态资源
│   ├── 造字工房映力黑规体.otf         # 标题字体文件
│   ├── AlibabaPuHuiTi-3-55-Regular.ttf    # 阿里巴巴普惠体 Regular
│   ├── AlibabaPuHuiTi-3-65-Medium.ttf     # 阿里巴巴普惠体 Medium
│   ├── AlibabaPuHuiTi-3-75-SemiBold.ttf  # 阿里巴巴普惠体 SemiBold
│   ├── AlibabaSans-Light.ttf        # Alibaba Sans Light
│   ├── AlibabaSans-Regular.ttf      # Alibaba Sans Regular
│   ├── AlibabaSans-Medium.ttf       # Alibaba Sans Medium
│   ├── AlibabaSans-Bold.ttf         # Alibaba Sans Bold
│   ├── Pic/                        # 图片资源
│   └── sound/                      # 音频文件
├── src/
│   ├── assets/                     # 样式文件
│   │   ├── base.css               # 基础样式和字体声明
│   │   └── main.css               # 主样式和字体工具类
│   ├── components/                # 可复用组件
│   ├── views/                     # 页面组件
│   ├── services/                  # API服务
│   ├── store/                     # 状态管理
│   └── types/                     # TypeScript类型定义
├── tailwind.config.js             # Tailwind配置（包含字体设置）
└── package.json
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- Vue.js 团队提供的优秀框架
- Tailwind CSS 的现代化样式解决方案
- 阿里巴巴普惠体开源字体项目
- 造字工房的优秀中文字体设计
- 植物识别API服务提供商
