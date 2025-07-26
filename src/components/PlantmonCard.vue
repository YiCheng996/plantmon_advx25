<script setup lang="ts">
import { computed } from 'vue'
import type { Plantmon } from '@/types/plantmon'
import { getPlantmonImageUrl } from '@/utils/imageUtils'

const props = defineProps<{
  plantmon: Plantmon
}>()

// 获取植宠图片URL
const plantmonImageUrl = computed(() => getPlantmonImageUrl(props.plantmon))
</script>

<template>
  <div class="plantmon-card relative aspect-square rounded-xl overflow-hidden">
    <!-- 植宠图片 -->
    <img
      :src="plantmonImageUrl"
      :alt="plantmon.nickname"
      class="w-full h-full object-cover"
      @error="
        ($event.target as HTMLImageElement).src =
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSI0MCI+8J+MujwvdGV4dD4KPHN2Zz4='
      "
    />

    <!-- 稀有度标识 -->
    <div
      class="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-bold"
    >
      {{
        plantmon.rarity === 'common'
          ? '常见'
          : plantmon.rarity === 'uncommon'
            ? '少见'
            : plantmon.rarity === 'rare'
              ? '珍稀'
              : 'SSR'
      }}
    </div>

    <!-- 出战标识 -->
    <div
      v-if="plantmon.isActive"
      class="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
    >
      出战
    </div>

    <!-- 植宠名称覆盖层 -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
      <h3 class="font-bold text-white text-sm font-chinese mb-1">{{ plantmon.nickname }}</h3>
      <p class="text-xs text-gray-300 font-chinese">{{ plantmon.common_name }}</p>
    </div>
  </div>
</template>

<style scoped>
.plantmon-card {
  /* 确保在移动端有正确的触摸反馈 */
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s ease;
}

/* 悬停效果 */
.plantmon-card:hover {
  transform: scale(1.02);
}

/* 图片加载失败时的占位符样式 */
img {
  transition: opacity 0.3s ease;
}
</style>
