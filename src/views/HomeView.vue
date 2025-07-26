<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { usePlantmonStore } from '@/store/plantmon'
import { getPlantmonImageUrl, isNoBgImage, getImageTypeDescription } from '@/utils/imageUtils'

const plantmonStore = usePlantmonStore()

// 获取当前出战的植宠
const activePlantmon = computed(() => plantmonStore.activePlantmon)

// 获取植宠图片URL
const plantmonImageUrl = computed(() => getPlantmonImageUrl(activePlantmon.value))

// 检查是否为去背图片
const isUsingNoBgImage = computed(() => isNoBgImage(activePlantmon.value))

// 获取图片类型描述（用于调试）
const imageTypeDescription = computed(() => {
  const description = getImageTypeDescription(activePlantmon.value)
  console.log('首页植宠图片类型:', description)
  return description
})

// 初始化数据
onMounted(async () => {
  // 如果还没有初始化过，则进行初始化
  if (plantmonStore.totalCount === 0 && !plantmonStore.isLoading) {
    await plantmonStore.initialize()
  }
})

// 外部对战链接（暂时设为空，后续由用户提供）
// const battleUrl = 'https://example.com/battle'
</script>

<template>
  <div class="home-page min-h-screen relative overflow-hidden">
    <!-- 背景图层 -->
    <div class="absolute inset-0">
      <img
        src="/Pic/scenes/背景.webp"
        alt="游戏背景"
        class="w-full h-full object-cover"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
      <!-- 渐变遮罩 -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"
      ></div>
    </div>

    <!-- 内容容器 -->
    <div class="relative z-10 flex flex-col h-screen">
      <!-- 顶部Logo区域 -->
      <header class="pt-6 pb-6 text-center">
        <div class="flex items-center justify-center">
          <img
            src="/Pic/scenes/logo.svg"
            alt="Plantmon Logo"
            class="h-50 w-auto drop-shadow-2xl"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          />
        </div>
      </header>

      <!-- 角色形象展示区 -->
      <div class="flex-1 flex items-center justify-center px-6 -mt-16">
        <div class="character-display flex flex-col items-center justify-center">
          <!-- 有出战植宠时显示植宠信息 -->
          <div v-if="activePlantmon" class="text-center mb-4">
            <div class="relative">
              <!-- 植宠图片 -->
              <img
                :src="plantmonImageUrl"
                :alt="activePlantmon.nickname"
                class="max-h-130 w-auto object-contain drop-shadow-2xl character-image"
                :class="{
                  'bg-transparent': isUsingNoBgImage,
                  'rounded-lg': !isUsingNoBgImage,
                }"
                @error="($event.target as HTMLImageElement).src = '/Pic/scenes/starrole.webp'"
                :title="imageTypeDescription"
              />
              <!-- 出战标识 -->
              <div
                class="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
              >
                出战中
              </div>
            </div>
            <!-- 植宠信息 -->
            <div class="mt-4 text-white text-center">
              <h2 class="text-xl font-bold mb-1 font-chinese">{{ activePlantmon.nickname }}</h2>
              <p class="text-sm text-gray-300 font-chinese">{{ activePlantmon.common_name }}</p>
              <div class="flex items-center justify-center mt-2 space-x-2">
                <span
                  class="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-chinese"
                >
                  {{
                    activePlantmon.rarity === 'common'
                      ? '常见'
                      : activePlantmon.rarity === 'uncommon'
                        ? '少见'
                        : activePlantmon.rarity === 'rare'
                          ? '珍稀'
                          : 'SSR'
                  }}
                </span>
                <span
                  v-if="activePlantmon.trait"
                  class="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-chinese"
                >
                  {{ activePlantmon.trait }}
                </span>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-else-if="plantmonStore.isLoading" class="text-center">
            <div
              class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30"
            >
              <div
                class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
            <p class="text-white font-chinese">正在加载植宠数据...</p>
          </div>

          <!-- 没有植宠时显示默认角色 -->
          <div v-else class="text-center">
            <img
              src="/Pic/scenes/starrole.webp"
              alt="植宠角色形象"
              class="max-h-130 w-auto object-contain drop-shadow-2xl character-image"
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            />
            <div class="mt-4 text-white">
              <h2 class="text-lg font-bold mb-2 font-chinese">还没有出战植宠</h2>
              <p class="text-sm text-gray-300 font-chinese">快去捕获你的第一只植宠吧！</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部导航按钮区域 -->
      <div class="pb-8">
        <div class="p-1">
          <div class="flex justify-center items-center">
            <!-- 图鉴按钮（左侧） -->
            <RouterLink
              to="/index"
              class="nav-button-svg flex flex-col items-center justify-center"
            >
              <img
                src="/Pic/elements/dex.svg"
                alt="植宠图鉴"
                class="w-24 h-24 drop-shadow-lg"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />
              <div class="text-sm font-chinese text-white/90 mt-3">图鉴</div>
            </RouterLink>

            <!-- 捕捉按钮（中央，主要按钮） -->
            <RouterLink
              to="/capture"
              class="nav-button-svg flex flex-col items-center justify-center relative"
            >
              <img
                src="/Pic/elements/catch.svg"
                alt="捕捉植宠"
                class="w-34 h-34 drop-shadow-2xl"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />
              <div class="text-base font-chinese text-white font-bold mt-3">捕捉</div>
              <!-- 主要按钮的光环效果 -->
              <!-- <div
                class="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-3xl animate-pulse"
              ></div> -->
            </RouterLink>

            <!-- 战斗按钮（右侧） -->
            <a
              href="https://plantmonfight.zeabur.app/"
              target="_blank"
              class="nav-button-svg flex flex-col items-center justify-center"
            >
              <img
                src="/Pic/elements/fight.svg"
                alt="战斗"
                class="w-24 h-24 drop-shadow-lg"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />
              <div class="text-sm font-chinese text-white/90 mt-3">战斗</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 移动端优化的样式 */
.home-page {
  -webkit-tap-highlight-color: transparent;
}

/* 角色形象展示区动画 */
.character-display {
  animation: float 4s ease-in-out infinite;
}

.character-image {
  animation: gentle-sway 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes gentle-sway {
  0%,
  100% {
    transform: translateX(0px) scale(1);
  }
  33% {
    transform: translateX(5px) scale(1.02);
  }
  66% {
    transform: translateX(-5px) scale(0.98);
  }
}

/* SVG导航按钮样式 */
.nav-button-svg {
  transform: scale(1);
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none !important;
  outline: none !important;
  border: none !important;
  background: none !important;
  color: inherit !important;
  padding: 1.2rem !important;
}

.nav-button-svg:hover {
  transform: scale(1.1) translateY(-2px);
  text-decoration: none !important;
  outline: none !important;
  background: none !important;
  color: inherit !important;
}

.nav-button-svg:active {
  transform: scale(1.05) translateY(0px);
  transition: all 0.1s ease;
  text-decoration: none !important;
  outline: none !important;
  background: none !important;
  color: inherit !important;
}

.nav-button-svg:focus {
  outline: none !important;
  text-decoration: none !important;
  background: none !important;
  color: inherit !important;
}

.nav-button-svg:visited {
  text-decoration: none !important;
  background: none !important;
  color: inherit !important;
}

.nav-button-svg:link {
  text-decoration: none !important;
  background: none !important;
  color: inherit !important;
}

/* 背景图片加载优化 */
img {
  transition: opacity 0.3s ease;
}

/* 去背图片优化显示 */
.character-image {
  /* 确保去背图片有良好的显示效果 */
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3));
}

.character-image.bg-transparent {
  /* 去背图片使用更强的阴影效果 */
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.4));
}
</style>
