<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePlantmonStore } from '@/store/plantmon'
import PlantmonCard from '@/components/PlantmonCard.vue'

const plantmonStore = usePlantmonStore()

// 获取所有植宠列表
const plantmons = computed(() => plantmonStore.plantmons)
</script>

<template>
  <div
    class="index-page min-h-screen bg-black bg-cover bg-center bg-no-repeat"
    style="background-image: url('/Pic/scenes/detailback.jpg')"
  >
    <!-- 顶部导航栏 -->
    <header class="bg-black/90 backdrop-blur-md sticky top-0 z-20">
      <div class="flex items-center justify-between p-4">
        <RouterLink
          to="/"
          class="flex items-center text-orange-500 hover:text-orange-400 transition-colors duration-200"
        >
          <img src="/Pic/elements/Arrow left.svg" alt="返回" class="w-6 h-6" />
        </RouterLink>
        <h1 class="text-lg font-bold text-white font-chinese">植宠图鉴</h1>
        <div class="w-6"></div>
        <!-- 占位，保持标题居中 -->
      </div>
    </header>

    <!-- 内容区域 -->
    <main class="p-4 pb-8">
      <!-- 植宠网格列表 -->
      <div v-if="plantmons.length > 0" class="grid grid-cols-2 gap-4">
        <RouterLink
          v-for="plantmon in plantmons"
          :key="plantmon.id"
          :to="`/detail/${encodeURIComponent(plantmon.id)}`"
          class="transform transition-all duration-200 hover:scale-[1.02]"
        >
          <PlantmonCard :plantmon="plantmon" />
        </RouterLink>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-16">
        <div
          class="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
        >
          <span class="text-6xl">🥚</span>
        </div>
        <h2 class="text-2xl font-bold text-white mb-3 font-chinese">图鉴空空如也</h2>
        <p class="text-gray-400 mb-8 leading-relaxed px-4 font-chinese">
          还没有收集到任何植宠<br />
          快去拍照发现新的伙伴吧！
        </p>
        <RouterLink
          to="/capture"
          class="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg font-chinese"
        >
          <span class="text-xl mr-2">📸</span>
          开始捕获
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 图鉴页样式 */
.index-page {
  /* 确保在移动端有正确的触摸反馈 */
  -webkit-tap-highlight-color: transparent;
}

/* 卡片悬停效果 */
.grid a:hover {
  transform: translateY(-2px);
}

/* 页面进入动画 */
.index-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
