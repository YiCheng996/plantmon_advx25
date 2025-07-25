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
  <div class="index-page min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
    <!-- 顶部导航栏 -->
    <header
      class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-white/20"
    >
      <div class="flex items-center justify-between p-4">
        <RouterLink
          to="/"
          class="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <span class="text-xl">←</span>
          <span class="ml-2 text-sm font-medium font-chinese">返回</span>
        </RouterLink>
        <h1 class="text-lg font-bold text-gray-800 flex items-center font-chinese">
          <span class="text-xl mr-2">📚</span>
          植宠图鉴
        </h1>
        <div class="w-16"></div>
        <!-- 占位，保持标题居中 -->
      </div>
    </header>

    <!-- 内容区域 -->
    <main class="p-4 pb-8">
      <!-- 统计信息卡片 -->
      <div
        class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/20"
      >
        <div class="text-center">
          <div class="flex items-center justify-center mb-3">
            <div
              class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <span class="text-2xl text-white">📊</span>
            </div>
          </div>
          <div class="text-3xl font-bold text-gray-800 mb-1 font-english">
            {{ plantmons.length }}
          </div>
          <div class="text-sm text-gray-500 mb-2 font-chinese">已收集的植宠</div>
          <div class="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span class="font-chinese"
              >🔥 战力总值:
              <span class="font-english">{{
                plantmons.reduce(
                  (sum, p) => sum + p.skills.reduce((s, skill) => s + (skill.damage || 0), 0),
                  0,
                )
              }}</span></span
            >
            <span class="font-chinese"
              >⚡ 技能总数:
              <span class="font-english">{{
                plantmons.reduce((sum, p) => sum + p.skills.length, 0)
              }}</span></span
            >
          </div>
        </div>
      </div>

      <!-- 植宠网格列表 -->
      <div v-if="plantmons.length > 0" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-800 font-chinese">我的植宠</h2>
          <div class="text-sm text-gray-500 font-chinese">点击查看详情</div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <RouterLink
            v-for="plantmon in plantmons"
            :key="plantmon.id"
            :to="`/detail/${encodeURIComponent(plantmon.id)}`"
            class="transform transition-all duration-200 hover:scale-[1.02]"
          >
            <PlantmonCard :plantmon="plantmon" />
          </RouterLink>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-16">
        <div
          class="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
        >
          <span class="text-6xl">🥚</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-700 mb-3">图鉴空空如也</h2>
        <p class="text-gray-500 mb-8 leading-relaxed px-4">
          还没有收集到任何植宠<br />
          快去拍照发现新的伙伴吧！
        </p>
        <RouterLink
          to="/capture"
          class="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
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
