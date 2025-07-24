<script setup lang="ts">
import { RouterView } from 'vue-router'
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
