<template>
  <div class="audio-controller fixed top-4 right-4 z-50">
    <!-- 音频控制按钮 -->
    <button
      @click="toggleAudio"
      class="audio-btn w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all duration-200"
      :title="isPlaying ? '暂停音乐' : '播放音乐'"
    >
      <!-- 播放图标 -->
      <svg v-if="!isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"
        />
      </svg>
      <!-- 暂停图标 -->
      <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"
        />
      </svg>
    </button>

    <!-- 音量控制滑块（点击音频按钮时显示） -->
    <div
      v-show="showVolumeControl"
      class="volume-control absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-sm rounded-lg p-3 min-w-[120px]"
    >
      <div class="flex items-center gap-2">
        <span class="text-white text-xs">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          :value="volume * 100"
          @input="setVolume"
          class="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <span class="text-white text-xs font-english">{{ Math.round(volume * 100) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { audioService } from '@/services/audioService'

// 响应式状态
const isPlaying = ref(false)
const volume = ref(0.5)
const showVolumeControl = ref(false)

// 切换音频播放状态
const toggleAudio = () => {
  if (isPlaying.value) {
    audioService.pause()
    isPlaying.value = false
  } else {
    audioService.resume()
    isPlaying.value = true
  }

  // 显示音量控制
  showVolumeControl.value = !showVolumeControl.value

  // 3秒后自动隐藏音量控制
  setTimeout(() => {
    showVolumeControl.value = false
  }, 3000)
}

// 设置音量
const setVolume = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newVolume = parseInt(target.value) / 100
  volume.value = newVolume
  audioService.setVolume(newVolume)
}

// 定时检查播放状态
let statusCheckInterval: number

onMounted(() => {
  // 初始状态
  isPlaying.value = audioService.isPlaying()

  // 每秒检查一次播放状态
  statusCheckInterval = setInterval(() => {
    isPlaying.value = audioService.isPlaying()
  }, 1000)

  // 点击其他地方时隐藏音量控制
  document.addEventListener('click', (e) => {
    const target = e.target as Element
    if (!target.closest('.audio-controller')) {
      showVolumeControl.value = false
    }
  })
})

onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval)
  }
})
</script>

<style scoped>
/* 自定义滑块样式 */
input[type='range'] {
  background: transparent;
  cursor: pointer;
}

input[type='range']::-webkit-slider-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: #ffffff30;
  border-radius: 2px;
}

input[type='range']::-webkit-slider-thumb {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -4px;
}

input[type='range']::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: #ffffff30;
  border-radius: 2px;
  border: none;
}

input[type='range']::-moz-range-thumb {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  border: none;
}

/* 按钮悬停效果 */
.audio-btn:hover {
  transform: scale(1.1);
}

.audio-btn:active {
  transform: scale(0.95);
}

/* 音量控制面板动画 */
.volume-control {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
