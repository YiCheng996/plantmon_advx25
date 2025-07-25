<script setup lang="ts">
import { RouterLink } from 'vue-router'

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
      <header class="pt-12 pb-6 text-center">
        <div class="flex items-center justify-center">
          <img
            src="/Pic/scenes/logo.svg"
            alt="Plantmon Logo"
            class="h-60 w-auto drop-shadow-2xl"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          />
        </div>
      </header>

      <!-- 角色形象展示区 -->
      <div class="flex-1 flex items-center justify-center px-6 -mt-16">
        <div class="character-display flex items-center justify-center">
          <img
            src="/Pic/scenes/starrole.webp"
            alt="植宠角色形象"
            class="max-h-130 w-auto object-contain drop-shadow-2xl character-image"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          />
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
              href="https://www.pokemon.com/us"
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
</style>
