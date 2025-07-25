<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { audioService } from '@/services/audioService'
import AudioController from '@/components/AudioController.vue'

// 用户交互提示状态
const showAudioPrompt = ref(false)

// 组件挂载时初始化并播放背景音乐
onMounted(() => {
  // 初始化音频服务
  audioService.init()

  // 尝试播放背景音乐
  audioService.play()

  // 检查是否需要用户交互
  setTimeout(() => {
    if (audioService.needsUserInteraction()) {
      showAudioPrompt.value = true
    }
  }, 1000)
})

// 组件卸载时暂停音乐
onUnmounted(() => {
  audioService.pause()
})

// 处理用户点击启用音频
const enableAudio = () => {
  audioService.play()
  showAudioPrompt.value = false
}
</script>

<template>
  <!-- 移动端优先的应用容器 -->
  <div class="app-container">
    <!-- 音频启用提示 -->
    <div
      v-if="showAudioPrompt"
      class="audio-prompt fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl p-6 m-4 max-w-sm text-center shadow-2xl">
        <div class="text-4xl mb-4">🎵</div>
        <h3 class="text-lg font-bold text-gray-800 mb-2 font-chinese">启用背景音乐</h3>
        <p class="text-sm text-gray-600 mb-6 font-chinese">
          点击下方按钮开始播放背景音乐，<br />获得更佳的游戏体验！
        </p>
        <button
          @click="enableAudio"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg font-chinese"
        >
          🎶 启用音乐
        </button>
      </div>
    </div>

    <!-- 音频控制器 -->
    <AudioController />
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
