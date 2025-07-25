<template>
  <div class="font-debug-page min-h-screen bg-gray-100 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center">字体加载调试页面</h1>

      <!-- 字体加载状态检查 -->
      <div class="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 class="text-xl font-semibold mb-4">字体加载状态</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 border rounded">
            <h3 class="font-semibold mb-2">斗鱼追光体2.0</h3>
            <p class="text-sm text-gray-600 mb-2">状态: {{ douYuFontStatus }}</p>
            <div class="font-chinese text-lg">测试文本：植物宠物大冒险</div>
          </div>
          <div class="p-4 border rounded">
            <h3 class="font-semibold mb-2">Roboto</h3>
            <p class="text-sm text-gray-600 mb-2">状态: {{ robotoFontStatus }}</p>
            <div class="font-english text-lg">Test Text: Plantmon Adventure</div>
          </div>
        </div>
      </div>

      <!-- 字体对比测试 -->
      <div class="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 class="text-xl font-semibold mb-4">字体对比测试</h2>

        <!-- 中文字体测试 -->
        <div class="mb-6">
          <h3 class="font-semibold mb-3">中文字体对比</h3>
          <div class="space-y-2">
            <div class="p-2 border-l-4 border-blue-500">
              <span class="text-sm text-gray-500">斗鱼追光体2.0:</span>
              <div class="font-chinese text-xl">植物宠物大冒险 - 欢迎来到奇幻世界</div>
            </div>
            <div class="p-2 border-l-4 border-green-500">
              <span class="text-sm text-gray-500">系统默认:</span>
              <div style="font-family: system-ui" class="text-xl">
                植物宠物大冒险 - 欢迎来到奇幻世界
              </div>
            </div>
            <div class="p-2 border-l-4 border-purple-500">
              <span class="text-sm text-gray-500">微软雅黑:</span>
              <div style="font-family: 'Microsoft YaHei'" class="text-xl">
                植物宠物大冒险 - 欢迎来到奇幻世界
              </div>
            </div>
          </div>
        </div>

        <!-- 英文字体测试 -->
        <div class="mb-6">
          <h3 class="font-semibold mb-3">英文字体对比</h3>
          <div class="space-y-2">
            <div class="p-2 border-l-4 border-blue-500">
              <span class="text-sm text-gray-500">Roboto:</span>
              <div class="font-english text-xl">Plantmon Adventure - Welcome to Fantasy World</div>
            </div>
            <div class="p-2 border-l-4 border-green-500">
              <span class="text-sm text-gray-500">系统默认:</span>
              <div style="font-family: system-ui" class="text-xl">
                Plantmon Adventure - Welcome to Fantasy World
              </div>
            </div>
            <div class="p-2 border-l-4 border-purple-500">
              <span class="text-sm text-gray-500">Arial:</span>
              <div style="font-family: Arial" class="text-xl">
                Plantmon Adventure - Welcome to Fantasy World
              </div>
            </div>
          </div>
        </div>

        <!-- 混合字体测试 -->
        <div>
          <h3 class="font-semibold mb-3">中英文混合测试</h3>
          <div class="space-y-2">
            <div class="p-2 border-l-4 border-blue-500">
              <span class="text-sm text-gray-500">混合字体:</span>
              <div class="font-mixed text-xl">
                Plantmon 植宠大冒险 Level 等级: 25 HP 生命值: 1500
              </div>
            </div>
            <div class="p-2 border-l-4 border-green-500">
              <span class="text-sm text-gray-500">系统默认:</span>
              <div style="font-family: system-ui" class="text-xl">
                Plantmon 植宠大冒险 Level 等级: 25 HP 生命值: 1500
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 字体路径测试 -->
      <div class="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 class="text-xl font-semibold mb-4">字体路径测试</h2>
        <div class="space-y-2 text-sm font-mono">
          <div><strong>斗鱼追光体路径:</strong> /斗鱼追光体2.0.ttf</div>
          <div><strong>Roboto来源:</strong> Google Fonts CDN</div>
          <div><strong>当前时间:</strong> {{ currentTime }}</div>
        </div>

        <!-- 手动检查按钮 -->
        <div class="mt-4">
          <button
            @click="checkFonts"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors mr-2"
          >
            重新检查字体状态
          </button>
        </div>
      </div>

      <!-- API连接测试 -->
      <div class="bg-white rounded-lg p-6 shadow-lg">
        <h2 class="text-xl font-semibold mb-4">API连接测试</h2>
        <div class="space-y-2 text-sm">
          <div><strong>环境:</strong> {{ apiConfig.isDev ? '开发环境' : '生产环境' }}</div>
          <div><strong>API地址:</strong> {{ apiConfig.apiUrl }}</div>
          <div><strong>测试状态:</strong> {{ apiTestStatus }}</div>
        </div>

        <!-- API测试按钮 -->
        <div class="mt-4">
          <button
            @click="testApi"
            :disabled="apiTesting"
            class="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
          >
            {{ apiTesting ? '测试中...' : '测试API连接' }}
          </button>
        </div>

        <!-- API测试结果 -->
        <div
          v-if="apiTestResult"
          class="mt-4 p-3 rounded"
          :class="apiTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          <div class="font-semibold">{{ apiTestResult.message }}</div>
          <div v-if="apiTestResult.details" class="text-xs mt-2 font-mono">
            {{ JSON.stringify(apiTestResult.details, null, 2) }}
          </div>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div class="mt-8 text-center">
        <RouterLink
          to="/"
          class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
        >
          返回首页
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { testApiConnection, checkProxyConfig } from '@/utils/apiTest'

const douYuFontStatus = ref('检查中...')
const robotoFontStatus = ref('检查中...')
const currentTime = ref('')
const apiTestStatus = ref('未测试')
const apiTesting = ref(false)
const apiTestResult = ref<any>(null)
const apiConfig = ref(checkProxyConfig())

// 检查字体是否加载
const checkFonts = async () => {
  try {
    // 检查斗鱼追光体
    if (document.fonts) {
      const douYuFont = new FontFace('DouYu ZhuiGuang', 'url(/斗鱼追光体2.0.ttf)')
      try {
        await douYuFont.load()
        douYuFontStatus.value = '✅ 已加载'
      } catch (error) {
        douYuFontStatus.value = '❌ 加载失败: ' + error
      }

      // 检查Roboto
      try {
        const robotoFont = new FontFace(
          'Roboto',
          'url(https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap)',
        )
        await robotoFont.load()
        robotoFontStatus.value = '✅ 已加载'
      } catch (error) {
        robotoFontStatus.value = '❌ 加载失败: ' + error
      }
    } else {
      douYuFontStatus.value = '⚠️ 浏览器不支持 FontFace API'
      robotoFontStatus.value = '⚠️ 浏览器不支持 FontFace API'
    }
  } catch (error) {
    console.error('字体检查失败:', error)
  }
}

// 更新时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString()
}

// 测试API连接
const testApi = async () => {
  apiTesting.value = true
  apiTestStatus.value = '测试中...'
  apiTestResult.value = null

  try {
    const result = await testApiConnection()
    apiTestResult.value = result
    apiTestStatus.value = result.success ? '✅ 连接成功' : '❌ 连接失败'
  } catch (error) {
    apiTestResult.value = {
      success: false,
      message: '测试过程中出现错误',
      details: error,
    }
    apiTestStatus.value = '❌ 测试失败'
  } finally {
    apiTesting.value = false
  }
}

onMounted(() => {
  updateTime()
  checkFonts()

  // 每秒更新时间
  setInterval(updateTime, 1000)
})
</script>

<style scoped>
.font-debug-page {
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}
</style>
