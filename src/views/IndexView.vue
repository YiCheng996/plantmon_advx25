<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { usePlantmonStore } from '@/store/plantmon'
import PlantmonCard from '@/components/PlantmonCard.vue'

const plantmonStore = usePlantmonStore()

// 获取所有植宠列表
const plantmons = computed(() => plantmonStore.plantmons)

// 初始化数据
onMounted(async () => {
  // 如果还没有初始化过，则进行初始化
  if (plantmonStore.totalCount === 0 && !plantmonStore.isLoading) {
    await plantmonStore.initialize()
  }
})
</script>

<template>
  <div
    class="index-page min-h-screen bg-black bg-cover bg-center bg-no-repeat relative"
    style="background-image: url('/Pic/scenes/111.png')"
  >
    <!-- 背景遮罩层，增强内容可读性 -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none"
    ></div>
    <!-- 顶部导航栏 -->
    <header class="bg-black/90 backdrop-blur-md sticky top-0 z-20 relative">
      <div class="flex items-center justify-between p-4">
        <RouterLink
          to="/"
          class="flex items-center text-orange-500 hover:text-orange-400 transition-colors duration-200"
        >
          <img src="/Pic/elements/Arrow left.svg" alt="返回" class="w-6 h-6" />
        </RouterLink>
        <h1 class="text-lg font-bold text-white font-chinese">植宠图鉴</h1>
        <div class="flex items-center text-sm text-gray-300 font-chinese">
          已收集：<span class="font-bold text-yellow-400 ml-1">{{ plantmons.length }}</span>
          <span v-if="plantmonStore.isLoading" class="ml-2 text-blue-400">加载中...</span>
        </div>
      </div>
    </header>

    <!-- 内容区域 -->
    <main class="p-4 pb-8 relative z-10">
      <!-- 加载状态 -->
      <div v-if="plantmonStore.isLoading && plantmons.length === 0" class="text-center py-16">
        <div class="bg-black/50 backdrop-blur-md rounded-3xl p-8 mx-4 border border-white/20">
          <h2 class="text-xl font-bold text-white mb-3 font-chinese drop-shadow-lg">
            正在加载植宠数据
          </h2>
          <p class="text-gray-300 font-chinese drop-shadow-md">
            请稍候，正在从服务器获取最新数据...
          </p>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="plantmonStore.hasErrors && plantmons.length === 0" class="text-center py-16">
        <div class="bg-black/50 backdrop-blur-md rounded-3xl p-8 mx-4 border border-white/20">
          <div
            class="w-20 h-20 bg-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-red-400/50 shadow-lg"
          >
            <span class="text-3xl">⚠️</span>
          </div>
          <h2 class="text-xl font-bold text-white mb-3 font-chinese drop-shadow-lg">加载失败</h2>
          <p class="text-gray-300 mb-6 px-4 font-chinese drop-shadow-md">
            无法从服务器获取植宠数据<br />
            请检查网络连接后重试
          </p>
          <button
            @click="plantmonStore.initialize()"
            class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg font-chinese"
          >
            重新加载
          </button>
        </div>
      </div>

      <!-- 植宠网格列表 -->
      <div v-else-if="plantmons.length > 0" class="grid grid-cols-2 gap-4">
        <RouterLink
          v-for="plantmon in plantmons"
          :key="plantmon.latin_name"
          :to="`/detail/${encodeURIComponent(plantmon.latin_name)}`"
          class="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative"
        >
          <PlantmonCard :plantmon="plantmon" />
        </RouterLink>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-16">
        <div class="bg-black/50 backdrop-blur-md rounded-3xl p-8 mx-4 border border-white/20">
          <div
            class="w-32 h-32 bg-gradient-to-br from-gray-600/50 to-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm border border-white/20"
          >
            <span class="text-6xl">🥚</span>
          </div>
          <h2 class="text-2xl font-bold text-white mb-3 font-chinese drop-shadow-lg">
            图鉴空空如也
          </h2>
          <p class="text-gray-300 mb-8 leading-relaxed px-4 font-chinese drop-shadow-md">
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
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 图鉴页样式 */
.index-page {
  /* 确保在移动端有正确的触摸反馈 */
  -webkit-tap-highlight-color: transparent;
  /* 确保背景图像固定 */
  background-attachment: fixed;
}

/* 背景图像优化 */
@media (max-width: 768px) {
  .index-page {
    /* 移动端使用scroll以避免性能问题 */
    background-attachment: scroll;
  }
}

/* 卡片悬停效果 */
.grid a:hover {
  transform: translateY(-2px) scale(1.02);
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3));
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

/* 状态卡片动画 */
.bg-black\/50 {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
