# Plantmon Adventure 🌱

一个基于Vue 3 + TypeScript的植物宠物捕获游戏，具有现代化的移动端设计和沉浸式的游戏体验。

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
src/
  services/
    audioService.ts     # 音频服务管理
  components/
    AudioController.vue # 音频控制组件
  App.vue              # 主应用（集成音频功能）
public/
  sound/
    homepage.wav       # 背景音乐文件
    combat.wav         # 战斗音效文件
```

## 浏览器兼容性

支持所有现代浏览器的Web Audio API，包括：

- Chrome 31+
- Firefox 25+
- Safari 6+
- Edge 12+
- 移动端浏览器

---

享受你的植物宠物冒险之旅！🌿✨
