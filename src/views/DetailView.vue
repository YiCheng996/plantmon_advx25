<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlantmonStore } from '@/store/plantmon'

const route = useRoute()
const router = useRouter()
const plantmonStore = usePlantmonStore()

// 获取路由参数中的植宠ID，并进行URL解码
const plantmonId = decodeURIComponent(route.params.id as string)

// 根据ID获取植宠数据
const plantmon = computed(() => plantmonStore.getPlantmonById(plantmonId))

// 检查是否为当前出战植宠
const isActive = computed(() => plantmon.value?.isActive || false)

// 设为出战
const toggleActive = () => {
  if (plantmon.value) {
    if (isActive.value) {
      // 如果已经是出战状态，暂不支持取消（根据需求）
      return
    } else {
      plantmonStore.setActivePlantmon(plantmon.value.id)
    }
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="detail-page min-h-screen bg-gray-50">
    <!-- 如果植宠不存在，显示错误页面 -->
    <div v-if="!plantmon" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="text-6xl mb-4">❌</div>
        <h2 class="text-lg font-semibold text-gray-700 mb-2">植宠不存在</h2>
        <p class="text-sm text-gray-500 mb-6">可能是链接错误或植宠已被删除</p>
        <button
          @click="goBack"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200"
        >
          返回
        </button>
      </div>
    </div>

    <!-- 植宠详情内容 -->
    <div v-else>
      <!-- 顶部导航栏 -->
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="flex items-center justify-between p-4">
          <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-800">
            <span class="text-xl">←</span>
            <span class="ml-2 text-sm">返回</span>
          </button>
          <h1 class="text-lg font-semibold text-gray-800">植宠详情</h1>
          <div class="w-12"></div>
          <!-- 占位，保持标题居中 -->
        </div>
      </header>

      <!-- 植宠主要信息区域 -->
      <div class="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6 text-white">
        <!-- 植宠图片 -->
        <div class="text-center mb-4">
          <div
            class="w-32 h-32 bg-white bg-opacity-20 rounded-full overflow-hidden mx-auto mb-4 flex items-center justify-center"
          >
            <img
              :src="plantmon.image"
              :alt="plantmon.name"
              class="w-full h-full object-cover"
              @error="
                ($event.target as HTMLImageElement).src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSI0MCI+8J+MujwvdGV4dD4KPHN2Zz4='
              "
            />
          </div>

          <!-- 基本信息 -->
          <h2 class="text-2xl font-bold mb-1">{{ plantmon.name }}</h2>
          <p class="text-white text-opacity-80 mb-3">{{ plantmon.id }}</p>

          <!-- 属性标签 -->
          <div class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="attr in plantmon.attributes"
              :key="attr"
              class="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full"
            >
              {{ attr }}
            </span>
          </div>
        </div>
      </div>

      <!-- 详细信息区域 -->
      <div class="p-4 space-y-4">
        <!-- 描述信息 -->
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">📖 介绍</h3>
          <p class="text-gray-600 leading-relaxed">{{ plantmon.description }}</p>
        </div>

        <!-- 技能信息 -->
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">⚡ 技能</h3>
          <div class="space-y-3">
            <div
              v-for="skill in plantmon.skills"
              :key="skill.name"
              class="border border-gray-200 rounded-lg p-3"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-800">{{ skill.name }}</h4>
                <span
                  v-if="skill.damage"
                  class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                >
                  {{ skill.damage }} 伤害
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ skill.description }}</p>
            </div>
          </div>
        </div>

        <!-- 出战状态控制 -->
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">⚔️ 出战状态</h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">
                {{ isActive ? '当前植宠正在出战中' : '设置此植宠为出战状态' }}
              </p>
            </div>
            <button
              @click="toggleActive"
              :class="[
                'px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200',
                isActive
                  ? 'bg-green-100 text-green-800 cursor-default'
                  : 'bg-blue-500 hover:bg-blue-600 text-white',
              ]"
            >
              {{ isActive ? '当前出战' : '设为出战' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 详情页样式 */
.detail-page {
  /* 确保在移动端有正确的触摸反馈 */
  -webkit-tap-highlight-color: transparent;
}
</style>
