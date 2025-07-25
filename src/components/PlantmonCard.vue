<script setup lang="ts">
import type { Plantmon } from '@/types/plantmon'

defineProps<{
  plantmon: Plantmon
}>()
</script>

<template>
  <div
    class="plantmon-card bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <!-- 植宠图片 -->
    <div
      class="relative aspect-square bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 rounded-lg mb-3 overflow-hidden"
    >
      <img
        :src="plantmon.image"
        :alt="plantmon.name"
        class="w-full h-full object-cover rounded-lg"
        @error="
          ($event.target as HTMLImageElement).src =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSI0MCI+8J+MujwvdGV4dD4KPHN2Zz4='
        "
      />

      <!-- 出战状态指示器 -->
      <div v-if="plantmon.isActive" class="absolute top-2 right-2">
        <div
          class="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg font-chinese"
        >
          <span class="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
          出战中
        </div>
      </div>
    </div>

    <!-- 植宠信息 -->
    <div class="text-center">
      <h3 class="font-bold text-gray-800 mb-1 text-lg font-chinese">{{ plantmon.name }}</h3>
      <p class="text-xs text-gray-500 mb-3 font-mono font-english">{{ plantmon.id }}</p>

      <!-- 属性标签 -->
      <div class="flex flex-wrap gap-1 justify-center mb-3">
        <span
          v-for="attr in plantmon.attributes.slice(0, 2)"
          :key="attr"
          :class="[
            'px-3 py-1 text-xs rounded-full font-medium font-chinese',
            getAttributeColor(attr),
          ]"
        >
          {{ attr }}
        </span>
      </div>

      <!-- 技能预览 -->
      <div class="text-xs text-gray-600 font-chinese">
        <span class="font-medium font-english">{{ plantmon.skills.length }}</span> 个技能
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
.plantmon-card {
  /* 确保在移动端有正确的触摸反馈 */
  -webkit-tap-highlight-color: transparent;
}

/* 悬停效果动画 */
.plantmon-card:hover {
  transform: translateY(-4px) scale(1.02);
}

/* 图片加载失败时的占位符样式 */
img {
  transition: opacity 0.3s ease;
}
</style>
