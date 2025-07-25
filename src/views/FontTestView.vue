<template>
  <div
    class="font-test-page min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4"
  >
    <!-- 顶部导航 -->
    <header class="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-4 mb-6">
      <div class="flex items-center justify-between">
        <RouterLink
          to="/"
          class="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <span class="text-xl">←</span>
          <span class="ml-2 text-sm font-medium font-chinese">返回首页</span>
        </RouterLink>
        <h1 class="text-lg font-bold text-gray-800 font-chinese">字体测试</h1>
        <div class="w-16"></div>
      </div>
    </header>

    <!-- 字体演示区域 -->
    <div class="space-y-6">
      <!-- 斗鱼追光体2.0 演示 -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h2 class="text-xl font-bold text-gray-800 mb-4 font-chinese">
          🎯 斗鱼追光体2.0 (中文字体)
        </h2>
        <div class="space-y-4">
          <div class="font-chinese text-4xl text-gray-800">植物宠物大冒险</div>
          <div class="font-chinese text-2xl text-gray-700">欢迎来到奇幻的植宠世界</div>
          <div class="font-chinese text-lg text-gray-600">
            在这里，每一株植物都有自己的生命和故事
          </div>
          <div class="font-chinese text-base text-gray-500">
            收集、培养、战斗，成为最强的植宠训练师！
          </div>
          <div class="font-chinese text-sm text-gray-400">字体特点：现代、清晰、易读性强</div>
        </div>
      </div>

      <!-- Roboto 演示 -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h2 class="text-xl font-bold text-gray-800 mb-4 font-chinese">🔤 Roboto (英文字体)</h2>
        <div class="space-y-4">
          <div class="font-english text-4xl text-gray-800">Plantmon Adventure</div>
          <div class="font-english text-2xl text-gray-700">Welcome to the Fantasy World</div>
          <div class="font-english text-lg text-gray-600">
            Every plant has its own life and story
          </div>
          <div class="font-english text-base text-gray-500">
            Collect, Train, Battle - Become the Ultimate Trainer!
          </div>
          <div class="font-english text-sm text-gray-400">
            Font Features: Modern, Clean, Highly Readable
          </div>
        </div>
      </div>

      <!-- 混合字体演示 -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h2 class="text-xl font-bold text-gray-800 mb-4 font-chinese">🌐 混合字体 (中英文混排)</h2>
        <div class="space-y-4">
          <div class="font-mixed text-3xl text-gray-800">Plantmon 植宠大冒险 Adventure</div>
          <div class="font-mixed text-xl text-gray-700">Level 等级: 25 | HP 生命值: 1500/1500</div>
          <div class="font-mixed text-lg text-gray-600">
            技能 Skills: 火焰冲击 Fire Blast, 自然治愈 Nature Heal
          </div>
          <div class="font-mixed text-base text-gray-500">
            经验值 EXP: 8750/10000 | 金币 Coins: ¥2,580
          </div>
          <div class="font-mixed text-sm text-gray-400">
            状态 Status: Active 出战中 | 位置 Location: 神秘森林 Mystic Forest
          </div>
        </div>
      </div>

      <!-- 字体权重演示 -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h2 class="text-xl font-bold text-gray-800 mb-4 font-chinese">⚖️ 字体权重演示</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <h3 class="font-semibold text-gray-700 font-chinese">中文字体权重</h3>
            <div class="font-chinese font-light text-gray-600">轻体 Light (300)</div>
            <div class="font-chinese font-normal text-gray-600">常规 Normal (400)</div>
            <div class="font-chinese font-medium text-gray-600">中等 Medium (500)</div>
            <div class="font-chinese font-semibold text-gray-600">半粗 Semibold (600)</div>
            <div class="font-chinese font-bold text-gray-600">粗体 Bold (700)</div>
          </div>
          <div class="space-y-2">
            <h3 class="font-semibold text-gray-700 font-chinese">英文字体权重</h3>
            <div class="font-english font-light text-gray-600">Light (300)</div>
            <div class="font-english font-normal text-gray-600">Normal (400)</div>
            <div class="font-english font-medium text-gray-600">Medium (500)</div>
            <div class="font-english font-semibold text-gray-600">Semibold (600)</div>
            <div class="font-english font-bold text-gray-600">Bold (700)</div>
          </div>
        </div>
      </div>

      <!-- 实际应用场景 -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h2 class="text-xl font-bold text-gray-800 mb-4 font-chinese">🎮 实际应用场景</h2>
        <div class="space-y-4">
          <!-- 模拟植宠卡片 -->
          <div class="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-4 border">
            <h3 class="font-bold text-lg text-gray-800 font-chinese">翡翠藤蔓</h3>
            <p class="text-sm text-gray-500 font-mono font-english">ID: PLANT_001_EMERALD_VINE</p>
            <div class="flex gap-2 my-2">
              <span class="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-chinese"
                >自然</span
              >
              <span class="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full font-chinese"
                >水系</span
              >
            </div>
            <p class="text-sm text-gray-600 font-chinese">
              一种拥有强大生命力的植宠，能够快速恢复自身和队友的生命值。
            </p>
            <div class="mt-3 flex justify-between items-center">
              <span class="font-chinese text-sm text-gray-500"
                >攻击力: <span class="font-english">850</span></span
              >
              <span class="font-chinese text-sm text-gray-500"
                >防御力: <span class="font-english">720</span></span
              >
              <span class="font-chinese text-sm text-gray-500"
                >速度: <span class="font-english">680</span></span
              >
            </div>
          </div>

          <!-- 模拟按钮组 -->
          <div class="flex gap-3">
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-chinese transition-colors"
            >
              🎯 开始战斗
            </button>
            <button
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-chinese transition-colors"
            >
              🌱 培养植宠
            </button>
            <button
              class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-chinese transition-colors"
            >
              📚 查看图鉴
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* 确保字体正确加载的样式 */
.font-test-page {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
