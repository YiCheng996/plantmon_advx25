<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlantmonStore } from '@/store/plantmon'
import type { Plantmon } from '@/types/plantmon'

const router = useRouter()
const plantmonStore = usePlantmonStore()

// DOM引用
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// 状态管理
const isCapturing = ref(false)
const showResultModal = ref(false)
const cameraReady = ref(false)
const cameraError = ref('')
const mediaStream = ref<MediaStream | null>(null)
const isRetrying = ref(false)
const retryCount = ref(0)
const maxRetries = 3

const captureResult = ref<{
  success: boolean
  plantmon?: Plantmon
  error?: string
}>({
  success: false,
})

// 初始化摄像头
const initCamera = async (isRetry = false) => {
  if (isRetry) {
    isRetrying.value = true
    retryCount.value++
  } else {
    retryCount.value = 0
  }
  try {
    console.log('开始初始化摄像头...')

    // 检查浏览器是否支持摄像头API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('浏览器不支持摄像头API')
    }

    // 等待DOM元素准备就绪
    await new Promise((resolve) => {
      const checkVideoElement = () => {
        console.log('检查视频元素状态:', videoRef.value ? '存在' : '不存在')
        if (videoRef.value) {
          console.log('视频元素准备就绪')
          resolve(null)
        } else {
          // 如果视频元素还没准备好，等待下一个tick
          setTimeout(checkVideoElement, 50)
        }
      }
      checkVideoElement()
    })

    // 清理之前的流
    cleanupCamera()

    // 先尝试简单的约束条件
    let constraints: MediaStreamConstraints = {
      video: {
        facingMode: 'environment', // 优先使用后置摄像头
      },
      audio: false,
    }

    console.log('请求摄像头权限...', constraints)
    let stream: MediaStream

    try {
      // 首先尝试后置摄像头
      stream = await navigator.mediaDevices.getUserMedia(constraints)
    } catch (backCameraError) {
      console.log('后置摄像头不可用，尝试前置摄像头...', backCameraError)
      // 如果后置摄像头失败，尝试前置摄像头
      constraints = {
        video: {
          facingMode: 'user',
        },
        audio: false,
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (frontCameraError) {
        console.log('前置摄像头也不可用，尝试任意摄像头...', frontCameraError)
        // 如果指定摄像头都失败，尝试任意可用的摄像头
        constraints = {
          video: true,
          audio: false,
        }
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      }
    }

    console.log('摄像头权限获取成功', stream)
    mediaStream.value = stream

    // 再次确认视频元素存在
    if (!videoRef.value) {
      throw new Error('视频元素引用不存在')
    }

    videoRef.value.srcObject = stream

    // 设置视频播放超时
    const playTimeout = setTimeout(() => {
      console.error('视频播放超时')
      cameraError.value = '摄像头启动超时，请重试'
      cameraReady.value = false
    }, 10000) // 10秒超时

    // 等待视频准备就绪
    await new Promise((resolve, reject) => {
      if (!videoRef.value) {
        clearTimeout(playTimeout)
        reject(new Error('视频元素不存在'))
        return
      }

      const video = videoRef.value

      // 监听多个事件以确保视频正常启动
      const onSuccess = () => {
        clearTimeout(playTimeout)
        console.log('视频流启动成功')
        // 清理事件监听器
        video.removeEventListener('loadedmetadata', onLoadedMetadata)
        video.removeEventListener('canplay', onCanPlay)
        video.removeEventListener('error', onError)
        resolve(null)
      }

      const onLoadedMetadata = () => {
        console.log('视频元数据加载完成')
        if (video.readyState >= 2) {
          // HAVE_CURRENT_DATA
          onSuccess()
        }
      }

      const onCanPlay = () => {
        console.log('视频可以播放')
        onSuccess()
      }

      const onError = (error: Event) => {
        clearTimeout(playTimeout)
        console.error('视频加载错误:', error)
        video.removeEventListener('loadedmetadata', onLoadedMetadata)
        video.removeEventListener('canplay', onCanPlay)
        video.removeEventListener('error', onError)
        reject(error)
      }

      // 添加事件监听器
      video.addEventListener('loadedmetadata', onLoadedMetadata)
      video.addEventListener('canplay', onCanPlay)
      video.addEventListener('error', onError)

      // 开始播放视频
      video.play().catch((playError) => {
        console.error('视频播放失败:', playError)
        // 即使播放失败，有时候视频流仍然可用
        if (video.readyState >= 2) {
          onSuccess()
        } else {
          onError(playError)
        }
      })

      // 检查视频是否已经准备好
      if (video.readyState >= 2) {
        onSuccess()
      }
    })

    cameraReady.value = true
    cameraError.value = ''
    isRetrying.value = false
    console.log('摄像头初始化完成')
  } catch (error) {
    console.error('摄像头初始化失败:', error)

    // 根据错误类型提供更详细的错误信息
    let errorMessage = '无法访问摄像头'

    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        errorMessage = '摄像头权限被拒绝，请在浏览器设置中允许访问摄像头'
      } else if (error.name === 'NotFoundError') {
        errorMessage = '未找到摄像头设备，请检查设备连接'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = '浏览器不支持摄像头功能'
      } else if (error.name === 'NotReadableError') {
        errorMessage = '摄像头被其他应用占用，请关闭其他使用摄像头的应用'
      } else if (error.name === 'AbortError') {
        errorMessage = '摄像头启动超时，请检查设备状态后重试'
      } else {
        errorMessage = `摄像头初始化失败: ${error.message}`
      }
    }

    cameraError.value = errorMessage
    cameraReady.value = false
    isRetrying.value = false

    // 如果是AbortError且重试次数未达到上限，自动重试
    if (error instanceof Error && error.name === 'AbortError' && retryCount.value < maxRetries) {
      console.log(`摄像头启动超时，${2}秒后自动重试 (${retryCount.value + 1}/${maxRetries})...`)
      setTimeout(() => {
        initCamera(true)
      }, 2000)
    }
  }
}

// 拍照功能
const takePhoto = (): string | null => {
  if (!videoRef.value || !canvasRef.value) return null

  const video = videoRef.value
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')

  if (!context) return null

  // 设置画布尺寸与视频尺寸一致
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // 将视频帧绘制到画布上
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  // 转换为base64格式的图片数据
  return canvas.toDataURL('image/jpeg', 0.8)
}

// 调用虚拟API接口进行植宠识别
const callPlantmonAPI = async (
  imageData: string,
): Promise<{
  success: boolean
  plantmon?: Plantmon
  error?: string
}> => {
  try {
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 模拟API请求（实际项目中这里会调用真实的后端接口）
    await fetch('/api/plantmon/recognize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData,
        timestamp: Date.now(),
      }),
    }).catch(() => {
      // 模拟网络请求失败，使用本地逻辑
      console.log('虚拟API调用失败，使用本地逻辑')
    })

    // 由于是虚拟接口，这里使用本地逻辑生成结果
    const isSuccess = Math.random() > 0.3 // 70%成功率

    if (isSuccess) {
      const newPlantmon = generateRandomPlantmon()
      return {
        success: true,
        plantmon: newPlantmon,
      }
    } else {
      return {
        success: false,
        error: 'AI识别失败，未能从照片中识别出植宠特征，请尝试拍摄其他物体',
      }
    }
  } catch (error) {
    console.error('API调用失败:', error)
    return {
      success: false,
      error: '网络连接失败，请检查网络设置后重试',
    }
  }
}

// 处理拍照和识别流程
const handleCapture = async () => {
  if (!cameraReady.value) {
    cameraError.value = '摄像头未就绪，请稍后重试'
    return
  }

  isCapturing.value = true

  try {
    // 1. 拍照
    const imageData = takePhoto()
    if (!imageData) {
      throw new Error('拍照失败')
    }

    // 2. 调用API进行植宠识别
    const apiResult = await callPlantmonAPI(imageData)

    if (apiResult.success && apiResult.plantmon) {
      // 3. 识别成功，添加到store
      plantmonStore.addPlantmon(apiResult.plantmon)

      captureResult.value = {
        success: true,
        plantmon: apiResult.plantmon,
      }
    } else {
      // 4. 识别失败
      captureResult.value = {
        success: false,
        error: apiResult.error || '识别失败',
      }
    }
  } catch (error) {
    console.error('拍照识别流程失败:', error)
    captureResult.value = {
      success: false,
      error: '拍照过程中出现错误，请重试',
    }
  } finally {
    isCapturing.value = false
    showResultModal.value = true
  }
}

// 生成随机植宠数据（模拟AI识别结果）
const generateRandomPlantmon = (): Plantmon => {
  const availableImages = [
    '/Pic/roles/20250724-183408.png',
    '/Pic/roles/20250724-183436.png',
    '/Pic/roles/20250724-183440.png',
    '/Pic/roles/20250724-183451.png',
    '/Pic/roles/20250724-183509.png',
    '/Pic/roles/20250724-183514.png',
    '/Pic/roles/20250724-183519.png',
  ]

  const names = [
    '星光守护者',
    '月影精灵',
    '烈焰战神',
    '冰霜法师',
    '暗夜刺客',
    '森林之王',
    '雷电领主',
  ]
  const attributePairs = [
    ['光明', '守护'],
    ['月亮', '精灵'],
    ['火焰', '战士'],
    ['冰霜', '法师'],
    ['暗影', '刺客'],
    ['自然', '王者'],
    ['雷电', '领主'],
  ]
  const descriptions = [
    '来自星空的神秘守护者，拥有无穷的光明力量。',
    '月夜中诞生的精灵，优雅而神秘。',
    '战场上的烈焰之神，所向披靡。',
    '掌控冰霜的智慧法师，冷静而强大。',
    '隐匿在黑暗中的致命刺客。',
    '森林的统治者，与自然和谐共生。',
    '操控雷电的强大领主，威震四方。',
  ]

  const randomIndex = Math.floor(Math.random() * names.length)
  const plantmonCount = plantmonStore.totalCount + 1

  return {
    id: `#${plantmonCount.toString().padStart(3, '0')}`,
    name: names[randomIndex],
    image: availableImages[randomIndex],
    attributes: attributePairs[randomIndex],
    skills: [
      {
        name: '基础攻击',
        description: '使用基本能力攻击敌人',
        damage: Math.floor(Math.random() * 20) + 25,
      },
      {
        name: '特殊技能',
        description: '释放独特的属性技能',
        damage: Math.floor(Math.random() * 30) + 35,
      },
    ],
    description: descriptions[randomIndex],
    isActive: false,
  }
}

// 切换摄像头（前置/后置）
const switchCamera = async () => {
  if (!mediaStream.value) return

  // 停止当前流
  mediaStream.value.getTracks().forEach((track) => track.stop())

  // 获取当前摄像头模式
  const currentFacingMode = mediaStream.value.getVideoTracks()[0]?.getSettings()?.facingMode
  const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user'

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: newFacingMode,
      },
      audio: false,
    })

    mediaStream.value = stream

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      videoRef.value.play()
    }
  } catch (error) {
    console.error('切换摄像头失败:', error)
    // 如果切换失败，重新初始化原摄像头
    initCamera()
  }
}

// 关闭弹窗
const closeModal = () => {
  showResultModal.value = false
  captureResult.value = { success: false }
}

// 查看详情
const viewDetails = () => {
  if (captureResult.value.plantmon) {
    router.push(`/detail/${captureResult.value.plantmon.id}`)
  }
}

// 继续捕捉
const continueCaptureCapture = () => {
  closeModal()
}

// 视频加载完成事件
const onVideoLoaded = () => {
  console.log('视频流加载完成')
  // 可以在这里添加额外的初始化逻辑
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 清理摄像头资源
const cleanupCamera = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop())
    mediaStream.value = null
  }
}

// 生命周期钩子
onMounted(async () => {
  // 确保DOM完全加载后再初始化摄像头
  await new Promise((resolve) => setTimeout(resolve, 100))
  initCamera()
})

onUnmounted(() => {
  cleanupCamera()
})
</script>

<template>
  <div class="capture-page min-h-screen bg-black relative overflow-hidden" data-capture-view>
    <!-- 隐藏的canvas元素，用于拍照 -->
    <canvas ref="canvasRef" class="hidden"></canvas>

    <!-- 顶部导航栏 -->
    <header
      class="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent"
    >
      <div class="flex items-center justify-between p-4 pt-6">
        <button
          @click="goHome"
          class="flex items-center text-white hover:text-gray-300 transition-colors duration-200"
        >
          <span class="text-xl">←</span>
          <span class="ml-2 text-sm font-medium">返回</span>
        </button>
        <h1 class="text-lg font-bold text-white flex items-center">
          <span class="text-xl mr-2">📸</span>
          拍照捕获
        </h1>
        <!-- 切换摄像头按钮 -->
        <button
          v-if="cameraReady"
          @click="switchCamera"
          class="flex items-center text-white hover:text-gray-300 transition-colors duration-200"
        >
          <span class="text-xl">🔄</span>
        </button>
        <div v-else class="w-8"></div>
      </div>
    </header>

    <!-- 相机预览区域 -->
    <div
      class="camera-container relative w-full h-screen flex items-center justify-center bg-black"
    >
      <!-- 真实摄像头视频流 -->
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="camera-video w-full h-full object-cover"
        :class="{ 'opacity-0': !cameraReady }"
        @loadedmetadata="onVideoLoaded"
      ></video>

      <!-- 摄像头错误或加载状态 -->
      <div
        v-if="!cameraReady"
        class="camera-placeholder w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative absolute inset-0 z-10"
      >
        <!-- 扫描线动画 -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="scan-line absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
          ></div>
        </div>

        <!-- 中心提示区域 -->
        <div class="text-center text-white z-10">
          <div
            class="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20"
          >
            <span class="text-4xl">{{ cameraError ? '⚠️' : '📷' }}</span>
          </div>
          <p class="text-lg mb-2 font-medium">
            {{
              cameraError
                ? '摄像头访问失败'
                : isRetrying
                  ? '正在重试启动摄像头...'
                  : '正在启动摄像头...'
            }}
          </p>
          <p class="text-sm text-gray-400 px-8 leading-relaxed">
            {{
              cameraError ||
              (isRetrying
                ? `重试中 (${retryCount}/${maxRetries})...`
                : '请允许浏览器访问摄像头权限')
            }}
          </p>
          <!-- 重试按钮 -->
          <button
            v-if="cameraError"
            @click="() => initCamera(true)"
            class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors duration-200"
            :disabled="isRetrying"
          >
            {{ isRetrying ? `重试中... (${retryCount}/${maxRetries})` : '重试' }}
          </button>
        </div>
      </div>

      <!-- 拍照边框装饰 -->
      <div v-if="cameraReady" class="scan-frame absolute inset-6 pointer-events-none">
        <!-- 四角扫描框 -->
        <div class="relative w-full h-full border-2 border-transparent">
          <!-- 左上角 -->
          <div
            class="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-green-400 rounded-tl-lg shadow-lg shadow-green-400/50"
          ></div>
          <!-- 右上角 -->
          <div
            class="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-green-400 rounded-tr-lg shadow-lg shadow-green-400/50"
          ></div>
          <!-- 左下角 -->
          <div
            class="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-green-400 rounded-bl-lg shadow-lg shadow-green-400/50"
          ></div>
          <!-- 右下角 -->
          <div
            class="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-green-400 rounded-br-lg shadow-lg shadow-green-400/50"
          ></div>
        </div>

        <!-- 中心十字线 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-6 h-6 border border-white/40 rounded-full">
            <div class="w-full h-full border border-white/60 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      <!-- 加载动画覆盖层 -->
      <div
        v-if="isCapturing"
        class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30"
      >
        <div class="text-center text-white">
          <div
            class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl"
          >
            <span class="text-4xl">🧬</span>
          </div>
          <p class="text-xl mb-2 font-bold">AI分析中...</p>
          <p class="text-sm text-gray-400 mb-4">正在识别拍摄内容</p>
          <div class="flex justify-center space-x-1">
            <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style="animation-delay: 0.1s"
            ></div>
            <div
              class="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
              style="animation-delay: 0.2s"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部拍照按钮区域 -->
    <div
      class="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent"
    >
      <div class="flex justify-center pb-8 pt-4">
        <button
          @click="handleCapture"
          :disabled="isCapturing || !cameraReady"
          class="capture-button relative w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 disabled:hover:scale-100 transition-all duration-200"
        >
          <!-- 外圈动画 -->
          <div
            v-if="cameraReady && !isCapturing"
            class="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full animate-ping"
          ></div>
          <span class="text-4xl relative z-10">{{
            isCapturing ? '⏳' : cameraReady ? '📸' : '⚠️'
          }}</span>
        </button>
      </div>

      <!-- 提示文字 -->
      <div class="text-center pb-4">
        <p class="text-white/80 text-sm">
          {{ isCapturing ? '请稍候...' : cameraReady ? '点击拍照' : '摄像头未就绪' }}
        </p>
      </div>
    </div>

    <!-- 结果弹窗 -->
    <div
      v-if="showResultModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4"
    >
      <div
        class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/20 transform animate-modal-in"
      >
        <!-- 成功结果 -->
        <div v-if="captureResult.success && captureResult.plantmon" class="text-center">
          <div
            class="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <span class="text-4xl">🎉</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">捕获成功！</h2>
          <p class="text-sm text-gray-500 mb-6">AI成功识别并生成了新的植宠伙伴</p>

          <!-- 新植宠信息卡片 -->
          <div
            class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 mb-6 border border-purple-100"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 rounded-full overflow-hidden mx-auto mb-3 shadow-md"
            >
              <img
                :src="captureResult.plantmon.image"
                :alt="captureResult.plantmon.name"
                class="w-full h-full object-cover"
                @error="
                  ($event.target as HTMLImageElement).src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSI0MCI+8J+MujwvdGV4dD4KPHN2Zz4='
                "
              />
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-1">{{ captureResult.plantmon.name }}</h3>
            <p class="text-sm text-gray-500 mb-3 font-mono">{{ captureResult.plantmon.id }}</p>
            <div class="flex flex-wrap gap-1 justify-center">
              <span
                v-for="attr in captureResult.plantmon.attributes"
                :key="attr"
                class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
              >
                {{ attr }}
              </span>
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex gap-3">
            <button
              @click="viewDetails"
              class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              查看详情
            </button>
            <button
              @click="continueCaptureCapture"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition-all duration-200"
            >
              继续捕捉
            </button>
          </div>
        </div>

        <!-- 失败结果 -->
        <div v-else class="text-center">
          <div
            class="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <span class="text-4xl">😔</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">识别失败</h2>
          <p class="text-sm text-gray-600 mb-6 leading-relaxed">{{ captureResult.error }}</p>

          <button
            @click="closeModal"
            class="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            重新尝试
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 拍照页样式 */
.capture-page {
  -webkit-tap-highlight-color: transparent;
}

/* 扫描线动画 */
.scan-line {
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% {
    top: 0;
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

/* 拍照按钮样式 */
.capture-button:active {
  transform: scale(0.95);
}

/* 边框粗细 */
.border-t-3 {
  border-top-width: 3px;
}
.border-r-3 {
  border-right-width: 3px;
}
.border-b-3 {
  border-bottom-width: 3px;
}
.border-l-3 {
  border-left-width: 3px;
}

/* 弹窗进入动画 */
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.3s ease-out;
}

/* 摄像头容器样式 */
.camera-container {
  /* 确保容器占满屏幕 */
  position: relative;
  background: #000;
}

/* 视频元素样式 */
.camera-video {
  /* 镜像显示，让用户感觉更自然 */
  transform: scaleX(-1);
  /* 确保视频完全填充容器 */
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  /* 移除默认的视频控件样式 */
  background: transparent;
}

/* 摄像头占位符样式 */
.camera-placeholder {
  /* 确保占位符也能完全填充 */
  width: 100%;
  height: 100%;
}

/* 扫描框样式优化 */
.scan-frame {
  /* 确保扫描框不会被视频遮挡 */
  z-index: 10;
}
</style>
