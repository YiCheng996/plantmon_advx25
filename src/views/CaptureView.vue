<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlantmonStore } from '@/store/plantmon'
import type { CaptureResult } from '@/types/plantmon'
import { transformImageUrl } from '@/utils/imageUtils'

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
// 添加摄像头朝向状态
const currentFacingMode = ref<'user' | 'environment'>('environment')
// 添加引导图显示状态
const showGuide = ref(true)

// 加载动画文字状态
const loadingTexts = [
  '正在搜索草木之灵...',
  '感知植物的生命力...',
  '解析叶片的秘密...',
  '唤醒沉睡的精灵...',
  '编织自然的魔法...',
  '凝聚大地的能量...',
  '塑造植宠的灵魂...',
  '即将完成召唤...',
]
const currentLoadingTextIndex = ref(0)
const currentLoadingText = ref(loadingTexts[0])
let loadingTextInterval: number | null = null

const captureResult = ref<CaptureResult>({
  success: false,
  message: '',
  from_database: false,
})

// 获取转换后的图片URL
const captureImageUrl = computed(() => {
  if (captureResult.value.no_bg_image_url) {
    return transformImageUrl(captureResult.value.no_bg_image_url)
  }
  if (captureResult.value.image_url) {
    return transformImageUrl(captureResult.value.image_url)
  }
  return '/Pic/roles/20250724-183408.png'
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
      currentFacingMode.value = 'environment'
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
        currentFacingMode.value = 'user'
      } catch (frontCameraError) {
        console.log('前置摄像头也不可用，尝试任意摄像头...', frontCameraError)
        // 如果指定摄像头都失败，尝试任意可用的摄像头
        constraints = {
          video: true,
          audio: false,
        }
        stream = await navigator.mediaDevices.getUserMedia(constraints)
        // 默认假设是后置摄像头
        currentFacingMode.value = 'environment'
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

// 调用真实API接口进行植宠生成
const callPlantmonAPI = async (imageData: string): Promise<CaptureResult> => {
  try {
    console.log('🚀 开始调用植宠生成API...')

    // 将base64图片数据转换为File对象
    const base64Response = await fetch(imageData)
    const blob = await base64Response.blob()
    const imageFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' })

    // 添加调试信息
    console.log('📊 文件对象信息:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size,
      lastModified: imageFile.lastModified,
    })
    console.log('📊 Blob信息:', {
      size: blob.size,
      type: blob.type,
    })

    console.log('📤 正在上传图片到API...')

    // 使用store中的processPlantImage方法调用API
    const result = await plantmonStore.processPlantImage(imageFile)
    console.log('✅ API返回结果:', result)

    return result
  } catch (error) {
    console.error('❌ API调用失败:', error)

    // 根据错误类型提供更具体的错误信息
    let errorMessage = '植宠生成失败，请重试'

    if (error instanceof Error) {
      if (error.message.includes('Not a plant')) {
        errorMessage = '捕获失败，请拍摄植物照片'
      } else if (error.message.includes('Low confidence')) {
        errorMessage = '捕获失败，请拍摄更清晰的植物照片'
      } else if (error.message.includes('网络')) {
        errorMessage = '捕获失败，请检查网络后重试'
      } else if (error.message.includes('超时')) {
        errorMessage = '捕获失败，请检查网络连接后重试'
      } else {
        errorMessage = error.message
      }
    }

    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
      from_database: false,
    }
  }
}

// 开始加载文字动画
const startLoadingTextAnimation = () => {
  currentLoadingTextIndex.value = 0
  currentLoadingText.value = loadingTexts[0]

  loadingTextInterval = setInterval(() => {
    currentLoadingTextIndex.value = (currentLoadingTextIndex.value + 1) % loadingTexts.length
    currentLoadingText.value = loadingTexts[currentLoadingTextIndex.value]
  }, 3000) // 每3秒切换一次
}

// 停止加载文字动画
const stopLoadingTextAnimation = () => {
  if (loadingTextInterval) {
    clearInterval(loadingTextInterval)
    loadingTextInterval = null
  }
}

// 处理拍照和识别流程
const handleCapture = async () => {
  if (!cameraReady.value) {
    cameraError.value = '摄像头未就绪，请稍后重试'
    return
  }

  isCapturing.value = true
  startLoadingTextAnimation()

  try {
    // 1. 拍照
    const imageData = takePhoto()
    if (!imageData) {
      throw new Error('拍照失败')
    }

    // 2. 调用API进行植宠识别
    const apiResult = await callPlantmonAPI(imageData)

    // 3. 设置结果
    captureResult.value = apiResult

    if (apiResult.success) {
      console.log('✅ 植宠生成成功:', apiResult.name)
    } else {
      console.error('❌ 植宠生成失败:', apiResult.error)
    }
  } catch (error) {
    console.error('拍照识别流程失败:', error)
    captureResult.value = {
      success: false,
      message: '拍照过程中出现错误，请重试',
      error: '拍照过程中出现错误，请重试',
      from_database: false,
    }
  } finally {
    stopLoadingTextAnimation()
    isCapturing.value = false
    showResultModal.value = true
  }
}

// 切换摄像头（前置/后置）
const switchCamera = async () => {
  if (!mediaStream.value) return

  // 停止当前流
  mediaStream.value.getTracks().forEach((track) => track.stop())

  // 切换摄像头模式
  const newFacingMode = currentFacingMode.value === 'user' ? 'environment' : 'user'

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
    currentFacingMode.value = newFacingMode

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
  captureResult.value = {
    success: false,
    message: '',
    from_database: false,
  }
}

// 查看详情
const viewDetails = () => {
  if (captureResult.value.profile_json) {
    // 使用拉丁名称作为路由参数
    const encodedLatinName = encodeURIComponent(captureResult.value.profile_json.latin_name)
    router.push(`/detail/${encodedLatinName}`)
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

  // 3秒后隐藏引导图
  setTimeout(() => {
    showGuide.value = false
  }, 3000)
})

onUnmounted(() => {
  cleanupCamera()
  stopLoadingTextAnimation()
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
          <img src="/Pic/elements/Arrow left.svg" alt="返回" class="w-6 h-6 mr-2" />
          <span class="text-sm font-medium">返回</span>
        </button>

        <!-- 切换摄像头按钮 -->
        <button
          v-if="cameraReady"
          @click="switchCamera"
          class="flex items-center text-white hover:text-gray-300 transition-colors duration-200"
        >
          <img src="/Pic/elements/Refresh cw.svg" alt="翻转摄像头" class="w-6 h-6" />
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
        :class="{
          'opacity-0': !cameraReady,
          'front-camera': currentFacingMode === 'user',
          'back-camera': currentFacingMode === 'environment',
        }"
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
          <p class="text-lg mb-2 font-medium font-chinese">
            {{
              cameraError
                ? '摄像头访问失败'
                : isRetrying
                  ? '正在重试启动摄像头...'
                  : '正在启动摄像头...'
            }}
          </p>
          <p class="text-sm text-gray-400 px-8 leading-relaxed font-chinese">
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
            class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors duration-200 font-chinese"
            :disabled="isRetrying"
          >
            {{ isRetrying ? `重试中... (${retryCount}/${maxRetries})` : '重试' }}
          </button>
        </div>
      </div>

      <!-- 引导图层 -->
      <div
        v-if="showGuide && cameraReady"
        class="absolute inset-0 flex flex-col items-center justify-center z-15 pointer-events-none transition-opacity duration-1000"
        :class="{ 'opacity-0': !showGuide }"
      >
        <!-- 引导图 -->
        <div class="mb-4">
          <img src="/Pic/elements/guide.svg" alt="拍照引导" class="w-64 h-64 object-contain" />
        </div>
        <!-- 提示文字 -->
        <p
          class="text-white text-lg font-medium font-chinese bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          瞄准植物拍照捕获
        </p>
      </div>

      <!-- 拍照边框装饰 -->
      <div v-if="cameraReady && !showGuide" class="scan-frame absolute inset-6 pointer-events-none">
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
          <div class="loading-text-container">
            <p class="text-xl font-bold font-chinese loading-text" key="currentLoadingText">
              {{ currentLoadingText }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部拍照按钮区域 -->
    <div
      class="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent"
    >
      <div class="flex justify-center pb-12 pt-8">
        <!-- 统一的拍照按钮 -->
        <div class="relative">
          <!-- 外圈装饰 -->
          <div
            v-if="cameraReady && !isCapturing"
            class="absolute -inset-6 rounded-full border-2 border-white/20 animate-pulse"
          ></div>
          <div
            v-if="cameraReady && !isCapturing"
            class="absolute -inset-3 rounded-full bg-gradient-to-r from-orange-400/20 to-green-400/20 animate-ping"
          ></div>

          <!-- 主按钮 -->
          <button
            @click="handleCapture"
            :disabled="isCapturing || !cameraReady"
            class="capture-button relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 disabled:hover:scale-100 transition-all duration-200 disabled:opacity-50"
          >
            <!-- 拍照图标 -->
            <img
              src="/Pic/elements/catch.svg"
              alt="拍照捕获"
              class="w-full h-full object-contain"
              :class="{
                'animate-pulse': isCapturing,
                'opacity-50': !cameraReady,
              }"
            />

            <!-- 拍照中的遮罩层 -->
            <div
              v-if="isCapturing"
              class="absolute inset-0 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <div
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- 结果弹窗 -->
    <div
      v-if="showResultModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4"
    >
      <div class="w-full max-w-sm transform animate-modal-in bg-transparent p-0">
        <!-- 成功结果 -->
        <div
          v-if="captureResult.success && captureResult.profile_json"
          class="svg-popup-container success-popup"
        >
          <!-- SVG弹窗背景 -->
          <img src="/Pic/elements/popup.svg" alt="弹窗背景" class="w-full h-full object-contain" />

          <!-- 关闭按钮 -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center text-white hover:text-gray-200 transition-colors duration-200 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- 弹窗内容 -->
          <div class="svg-popup-content success-content">
            <!-- 标题区域 -->
            <div class="flex-shrink-0">
              <h2 class="text-xl font-bold text-white font-chinese drop-shadow-lg mb-2">
                {{ captureResult.from_database ? '发现已知植宠！' : '捕获成功！' }}
              </h2>
            </div>

            <!-- 植宠信息区域 -->
            <div class="flex-1 flex flex-col items-center justify-center px-2">
              <!-- 植宠头像 -->
              <div
                class="w-20 h-20 bg-gradient-to-br from-purple-100/20 via-blue-100/20 to-green-100/20 rounded-full overflow-hidden mb-3 shadow-lg border-2 border-white/30 backdrop-blur-sm"
              >
                <img
                  :src="captureImageUrl"
                  :alt="captureResult.profile_json?.nickname || captureResult.name"
                  class="w-full h-full object-cover"
                  @error="
                    ($event.target as HTMLImageElement).src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSI0MCI+8J+MujwvdGV4dD4KPHN2Zz4='
                  "
                />
              </div>

              <!-- 植宠名称 -->
              <h3 class="text-lg font-bold text-white mb-1 font-chinese drop-shadow-lg">
                {{ captureResult.profile_json?.nickname || captureResult.name || '未知植宠' }}
              </h3>
              <p class="text-sm text-white/90 mb-2 font-chinese drop-shadow-md">
                {{ captureResult.profile_json?.common_name || '未知植物' }}
              </p>

              <!-- 标签 -->
              <div class="flex flex-wrap gap-1 justify-center mb-2">
                <span
                  class="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-medium font-chinese border border-white/30"
                >
                  {{
                    captureResult.profile_json?.rarity === 'common'
                      ? '常见'
                      : captureResult.profile_json?.rarity === 'uncommon'
                        ? '少见'
                        : captureResult.profile_json?.rarity === 'rare'
                          ? '珍稀'
                          : 'SSR'
                  }}
                </span>
                <span
                  v-if="captureResult.profile_json?.trait"
                  class="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-medium font-chinese border border-white/30"
                >
                  {{ captureResult.profile_json.trait }}
                </span>
              </div>
            </div>

            <!-- 按钮区域 -->
            <div class="flex-shrink-0 flex gap-2">
              <button
                @click="viewDetails"
                class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-chinese shadow-lg text-sm"
              >
                查看详情
              </button>
              <button
                @click="continueCaptureCapture"
                class="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 font-chinese shadow-lg text-sm border border-white/30"
              >
                继续捕获
              </button>
            </div>
          </div>
        </div>

        <!-- 失败结果 -->
        <div v-else class="svg-popup-container failure-popup">
          <!-- SVG弹窗背景 -->
          <img src="/Pic/elements/popup.svg" alt="弹窗背景" class="w-full h-full object-contain" />

          <!-- 关闭按钮 -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center text-white hover:text-gray-200 transition-colors duration-200 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- 弹窗内容 -->
          <div class="svg-popup-content">
            <!-- 标题区域 -->
            <div class="flex-shrink-0">
              <h2 class="text-2xl font-bold text-white font-chinese drop-shadow-lg">捕获失败</h2>
            </div>

            <!-- 错误信息区域 -->
            <div class="flex-1 flex items-center justify-center px-2">
              <p
                class="text-base text-white/90 leading-relaxed font-chinese drop-shadow-md text-center"
              >
                {{ captureResult.error }}
              </p>
            </div>

            <!-- 按钮区域 -->
            <div class="flex-shrink-0">
              <button
                @click="closeModal"
                class="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 font-chinese shadow-lg"
              >
                重新尝试
              </button>
            </div>
          </div>
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
  /* 确保视频完全填充容器 */
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  /* 移除默认的视频控件样式 */
  background: transparent;
}

/* 前置摄像头镜像显示，后置摄像头不镜像 */
.camera-video.front-camera {
  transform: scaleX(-1);
}

.camera-video.back-camera {
  transform: none;
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

/* 引导图渐隐动画 */
.guide-fade-out {
  animation: fadeOut 1s ease-out forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* 统一拍照按钮样式 */
.capture-button:active {
  transform: scale(0.95);
}

.capture-button:disabled {
  cursor: not-allowed;
}

/* SVG弹窗样式 */
.svg-popup-container {
  position: relative;
  width: 100%;
  max-width: 320px;
  height: auto;
  aspect-ratio: 319/221; /* 根据SVG的宽高比设置 */
  margin: 0 auto;
}

.svg-popup-content {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  height: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  /* padding: 2rem 1rem; */
}

/* 失败弹窗专用样式 */
.failure-popup {
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3));
}

/* 成功弹窗专用样式 */
.success-popup {
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3));
}

.success-content {
  /* 成功弹窗内容调整 */
  top: 8%;
  height: 80%;
  padding: 1rem 0.75rem;
}

/* 加载文字动画样式 */
.loading-text-container {
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  animation: fadeInOut 3s ease-in-out infinite;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  20% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .svg-popup-container {
    max-width: 280px;
  }

  .svg-popup-content {
    width: 80%;
    height: 70%;
    padding: 1.5rem 0.75rem;
    top: 18%;
  }

  .svg-popup-content h2 {
    font-size: 1.25rem;
  }

  .svg-popup-content p {
    font-size: 0.875rem;
    padding: 0 0.5rem;
  }

  .svg-popup-content button {
    font-size: 0.875rem;
    padding: 0.75rem 2rem;
  }

  /* 成功弹窗响应式调整 */
  .success-content {
    top: 6%;
    height: 85%;
    padding: 0.75rem 0.5rem;
  }

  .success-content h2 {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .success-content h3 {
    font-size: 1rem;
  }

  .success-content p {
    font-size: 0.75rem;
  }

  .success-content .w-20 {
    width: 4rem;
    height: 4rem;
  }
}
</style>
