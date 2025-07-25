<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePlantmonStore } from '@/store/plantmon'

const plantmonStore = usePlantmonStore()

// 获取当前出战的植宠
const activePlantmon = computed(() => plantmonStore.activePlantmon)

// 外部对战链接（暂时设为空，后续由用户提供）
// const battleUrl = 'https://example.com/battle'
</script>

<template>
  <div class="home-page min-h-screen relative overflow-hidden">
    <!-- 背景图层 -->
    <div class="absolute inset-0">
      <img
        src="/Pic/scenes/背景.png"
        alt="游戏背景"
        class="w-full h-full object-cover"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
      <!-- 渐变遮罩 -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"
      ></div>
    </div>

    <!-- 内容容器 -->
    <div class="relative z-10 flex flex-col h-screen">
      <!-- 顶部Logo区域 -->
      <header class="pt-12 pb-6 text-center">
        <div class="bg-black/20 backdrop-blur-sm rounded-2xl mx-6 py-4">
          <h1 class="text-4xl font-bold text-white mb-2 drop-shadow-lg font-mixed">🌱 Plantmon</h1>
        </div>
      </header>

      <!-- 植宠展示区（核心区域） -->
      <div class="flex-1 flex items-center justify-center px-6">
        <div
          class="plantmon-display bg-white/95 backdrop-blur-md rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/20"
        >
          <!-- 状态一：无植宠 -->
          <div v-if="!activePlantmon" class="text-center py-8">
            <div
              class="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"
            >
              <span class="text-4xl">🥚</span>
            </div>
            <h2 class="text-xl font-bold text-gray-700 mb-2 font-chinese">等待孵化中...</h2>
            <p class="text-sm text-gray-500 leading-relaxed font-chinese">
              快去捕获你的第一只植宠吧！<br />每一次拍照都可能遇到奇迹
            </p>
          </div>

          <!-- 状态二：有植宠 -->
          <div v-else class="text-center py-4">
            <!-- 植宠图片 -->
            <div class="relative w-32 h-32 mx-auto mb-4">
              <div
                class="w-full h-full bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 rounded-full overflow-hidden shadow-lg"
              >
                <img
                  :src="activePlantmon.image"
                  :alt="activePlantmon.name"
                  class="w-full h-full object-cover"
                  @error="
                    ($event.target as HTMLImageElement).src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSI0MCI+8J+MujwvdGV4dD4KPHN2Zz4='
                  "
                />
              </div>
              <!-- 出战光环效果 -->
              <div
                class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse opacity-75"
              ></div>
            </div>

            <!-- 植宠信息 -->
            <h2 class="text-2xl font-bold text-gray-800 mb-1 font-chinese">
              {{ activePlantmon.name }}
            </h2>
            <p class="text-sm text-gray-500 mb-3 font-mono font-english">{{ activePlantmon.id }}</p>

            <!-- 属性标签 -->
            <div class="flex flex-wrap gap-2 justify-center mb-4">
              <span
                v-for="attr in activePlantmon.attributes"
                :key="attr"
                :class="[
                  'px-3 py-1 text-xs rounded-full font-medium shadow-sm font-chinese',
                  getAttributeColor(attr),
                ]"
              >
                {{ attr }}
              </span>
            </div>

            <!-- 简短描述 -->
            <p class="text-xs text-gray-600 leading-relaxed px-2 font-chinese">
              {{ activePlantmon.description.slice(0, 50) }}...
            </p>
          </div>
        </div>
      </div>

      <!-- 底部导航按钮区域 -->
      <div class="pb-8 px-6">
        <div class="bg-black/20 backdrop-blur-sm rounded-3xl p-4">
          <div class="grid grid-cols-3 gap-4">
            <!-- AI生成按钮（核心按钮） -->
            <RouterLink
              to="/capture"
              class="nav-button bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
            >
              <div class="text-3xl mb-2">🤖</div>
              <div class="text-xs opacity-80 font-chinese">AI生成植宠</div>
            </RouterLink>

            <!-- 图鉴按钮 -->
            <RouterLink
              to="/index"
              class="nav-button bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <div class="text-3xl mb-2">📚</div>
              <div class="text-sm font-bold font-chinese">植宠图鉴</div>
            </RouterLink>

            <!-- 调试工具按钮 -->
            <RouterLink
              to="/font-debug"
              class="nav-button bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              <div class="text-3xl mb-2">🔧</div>
              <div class="text-sm font-bold font-chinese">调试工具</div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    getAttributeColor(attribute: string): string {
      const colorMap: Record<string, string> = {
        火焰: 'bg-red-100 text-red-800',
        冰霜: 'bg-blue-100 text-blue-800',
        自然: 'bg-green-100 text-green-800',
        暗影: 'bg-gray-100 text-gray-800',
        神秘: 'bg-purple-100 text-purple-800',
        守护: 'bg-yellow-100 text-yellow-800',
        精灵: 'bg-pink-100 text-pink-800',
        敏捷: 'bg-cyan-100 text-cyan-800',
        战士: 'bg-orange-100 text-orange-800',
        法师: 'bg-indigo-100 text-indigo-800',
      }
      return colorMap[attribute] || 'bg-gray-100 text-gray-800'
    },
  },
}
</script>

<style scoped>
/* 移动端优化的样式 */
.home-page {
  -webkit-tap-highlight-color: transparent;
}

/* 植宠展示区动画 */
.plantmon-display {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 导航按钮样式 */
.nav-button {
  border-radius: 1rem; /* rounded-2xl equivalent */
  padding: 1rem; /* p-4 equivalent */
  text-align: center;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg equivalent */
  transform: scale(1);
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.nav-button:hover {
  transform: scale(1.05);
}

.nav-button:active {
  transform: scale(0.95);
}

/* 背景图片加载优化 */
img {
  transition: opacity 0.3s ease;
}
</style>
