# Plantmon Adventure 🌱

一个基于Vue 3 + TypeScript的植物宠物捕获游戏，具有现代化的移动端设计和沉浸式的游戏体验。

## 🤖 AI植宠生成功能

### API集成

- **接口地址**: `https://plantmonapi.zeabur.app/process`
- **请求方式**: POST
- **参数**: FormData格式上传图片文件，参数名为`image`
- **返回**: JSON格式，包含`image_url`字段

### 功能特性

- 📸 **拍照上传**: 使用摄像头拍照，自动上传到AI生成接口
- 🤖 **AI处理**: 后端AI服务将照片转化为独特的植宠角色
- 🎨 **动态生成**: 每次拍照都会生成不同的植宠，具有随机属性和技能
- ⏱️ **超时处理**: 30秒请求超时，确保用户体验
- 🔄 **智能回退**: API失败时使用本地备用生成逻辑

### 使用流程

1. 点击首页的"AI生成植宠"按钮
2. 允许浏览器访问摄像头权限
3. 拍摄任意物体的照片
4. AI自动处理并生成独特的植宠角色
5. 查看生成的植宠详情或继续生成更多

### 技术实现

```typescript
// 核心API调用逻辑
const response = await fetch('https://plantmonapi.zeabur.app/process', {
  method: 'POST',
  body: formData, // 包含图片文件
  signal: controller.signal, // 30秒超时控制
})

const result = await response.json()
// result.image_url 包含生成的植宠图片URL
```

## 🎨 字体配置

### 字体方案

- **中文字体**: 斗鱼追光体2.0 - 现代、清晰的中文显示效果
- **英文字体**: Roboto - Google设计的高可读性英文字体
- **混合字体**: 智能字体堆栈，自动选择最适合的字体

### 字体文件

- `public/斗鱼追光体2.0.ttf` - 主要中文字体文件
- Google Fonts CDN - Roboto英文字体（自动加载）

### 使用方式

#### Tailwind CSS类

```html
<!-- 纯中文文本 -->
<div class="font-chinese">这是中文文本</div>

<!-- 纯英文文本 -->
<div class="font-english">This is English text</div>

<!-- 中英文混合文本 -->
<div class="font-mixed">混合文本 Mixed Text</div>

<!-- 默认字体（推荐用于混合内容） -->
<div class="font-sans">默认混合字体 Default Font</div>
```

#### CSS类

```css
.font-chinese {
  font-family: 'DouYu ZhuiGuang', 'Microsoft YaHei', '微软雅黑', sans-serif;
}
.font-english {
  font-family:
    'Roboto',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}
.font-mixed {
  font-family: 'DouYu ZhuiGuang', 'Roboto', sans-serif;
}
```

### 字体特性

- 🎯 **智能回退**: 如果主字体不可用，自动使用系统字体
- ⚡ **性能优化**: 使用`font-display: swap`优化加载体验
- 📱 **跨平台**: 支持Windows、macOS、Android、iOS等平台
- 🎨 **美观设计**: 专为游戏界面优化的字体选择

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
  assets/
    base.css           # 基础样式和字体配置
    main.css           # 主样式文件和字体工具类
  App.vue              # 主应用（集成音频功能）
public/
  斗鱼追光体2.0.ttf    # 中文字体文件
  sound/
    homepage.wav       # 背景音乐文件
    combat.wav         # 战斗音效文件
tailwind.config.js     # Tailwind字体配置
```

## 浏览器兼容性

### 字体支持

- 支持所有现代浏览器的Web字体加载
- 自动回退到系统字体确保兼容性

### 音频支持

支持所有现代浏览器的Web Audio API，包括：

- Chrome 31+
- Firefox 25+
- Safari 6+
- Edge 12+
- 移动端浏览器

---

享受你的植物宠物冒险之旅！🌿✨
