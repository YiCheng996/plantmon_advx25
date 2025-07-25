<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import { audioService } from '@/services/audioService'

// 组件挂载时初始化并播放背景音乐
onMounted(() => {
  // 初始化音频服务
  audioService.init()

  // 尝试播放背景音乐
  audioService.play()
})

// 组件卸载时销毁音频服务
onUnmounted(() => {
  audioService.destroy()
})
</script>

<template>
  <!-- 移动端优先的应用容器 -->
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style scoped>
/* 确保应用在所有设备上都以移动端布局显示 */
.app-container {
  /* 最大宽度限制为移动端尺寸 */
  max-width: 28rem; /* 约 448px，典型的大屏手机宽度 */
  /* 居中显示 */
  margin: 0 auto;
  /* 最小高度为全屏 */
  min-height: 100vh;
  /* 浅灰色背景，但允许子组件覆盖 */
  background-color: #f3f4f6;
  /* 移除padding，让全屏组件（如CaptureView）可以占满整个容器 */
  padding: 0;
  /* 确保容器不会溢出 */
  overflow-x: hidden;
}

/* 特殊处理：当路由是capture时，移除背景色让摄像头界面全黑 */
.app-container:has([data-capture-view]) {
  background-color: transparent;
}
</style>
