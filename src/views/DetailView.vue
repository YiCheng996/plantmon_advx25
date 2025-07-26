<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlantmonStore } from '@/store/plantmon'
import { getPlantmonImageUrl } from '@/utils/imageUtils'

const route = useRoute()
const router = useRouter()
const plantmonStore = usePlantmonStore()

// 获取路由参数中的拉丁名称，并进行URL解码
const latinName = decodeURIComponent(route.params.id as string)

// 根据拉丁名称获取植宠数据
const plantmon = computed(() => plantmonStore.getPlantmonByLatinName(latinName))

// 获取植宠图片URL
const plantmonImageUrl = computed(() => getPlantmonImageUrl(plantmon.value || null))

// 加载状态
const loading = ref(false)
const error = ref('')

// 初始化数据
onMounted(async () => {
  // 如果store中没有数据，先初始化
  if (plantmonStore.totalCount === 0) {
    await plantmonStore.initialize()
  }

  // 如果仍然找不到植宠，尝试单独获取
  if (!plantmon.value && !plantmonStore.isLoading) {
    await loadPlantmonDetail()
  }
})

// 加载植宠详情
const loadPlantmonDetail = async () => {
  loading.value = true
  error.value = ''

  try {
    const detail = await plantmonStore.getPlantmonDetail(latinName)

    // 将获取的详情转换为Plantmon格式并添加到store
    const newPlantmon = {
      ...detail.profile,
      id: `#${String(plantmonStore.totalCount + 1).padStart(3, '0')}`,
      image_url: detail.image_url,
      no_bg_image_url: detail.no_bg_image_url,
      isActive: false,
      created_at: detail.created_at,
      updated_at: detail.updated_at,
    }

    plantmonStore.addPlantmon(newPlantmon)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载植宠详情失败'
    console.error('加载植宠详情失败:', err)
  } finally {
    loading.value = false
  }
}

// 检查是否为当前出战植宠
const isActive = computed(() => plantmon.value?.isActive || false)

// 当前激活的标签页
const activeTab = ref('details')

// 设为出战
const toggleActive = () => {
  if (plantmon.value) {
    if (isActive.value) {
      // 如果已经是出战状态，暂不支持取消（根据需求）
      return
    } else {
      plantmonStore.setActivePlantmon(plantmon.value.latin_name)
    }
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 切换标签页
const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

// 计算属性进度条填充数量（基于1-100的值）
const getProgressFill = (value: number) => {
  // 将1-100的值转换为1-15个进度段
  return Math.ceil((value / 100) * 15)
}

// 模拟属性数据（后续将从API获取）
const attributeData = computed(() => [
  { name: '攻击力', value: 68, icon: 'damage' },
  { name: '防御力', value: 45, icon: 'shield-shaded' },
  { name: '速度', value: 82, icon: 'move' },
  { name: '生命值', value: 55, icon: 'HP' },
  { name: '魔法', value: 73, icon: 'lightning' },
])
</script>

<template>
  <div class="screen bg-black relative">
    <!-- 背景图片 -->
    <img class="background-image" alt="" src="/Pic/scenes/detailback.jpg" />

    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-20 relative">
      <div class="flex items-center justify-between p-4">
        <button
          @click="goBack"
          class="flex items-center text-orange-500 hover:text-orange-400 transition-colors duration-200"
        >
          <img src="/Pic/elements/Arrow left.svg" alt="返回" class="w-6 h-6" />
        </button>
        <h1 class="text-lg font-bold text-white font-chinese">植宠详情</h1>
        <div class="w-6"></div>
        <!-- 占位元素，保持居中 -->
      </div>
    </header>

    <!-- 如果植宠不存在，显示错误页面 -->
    <div v-if="!plantmon" class="error-container relative z-10">
      <div
        class="error-content bg-black/50 backdrop-blur-md rounded-3xl p-8 mx-4 border border-white/20"
      >
        <div class="error-emoji">❌</div>
        <h2 class="error-title">植宠不存在</h2>
        <p class="error-message">可能是链接错误或植宠已被删除</p>
        <button @click="goBack" class="error-button">
          <img src="/Pic/elements/Arrow left.svg" alt="返回" class="error-button-icon" />
          返回
        </button>
      </div>
    </div>

    <!-- 植宠详情内容 -->
    <div v-else class="detail-container relative z-10">
      <!-- 圆形渐变背景 -->
      <div class="circle-gradient"></div>

      <!-- 半透明容器 -->
      <div class="content-container"></div>

      <!-- 植宠等级 -->
      <div class="rarity-badge">
        {{
          plantmon.rarity === 'common'
            ? '常见'
            : plantmon.rarity === 'uncommon'
              ? '少见'
              : plantmon.rarity === 'rare'
                ? '珍稀'
                : 'SSR'
        }}
      </div>

      <!-- 植宠图片 -->
      <img
        class="plantmon-image"
        :src="plantmonImageUrl"
        :alt="plantmon.nickname"
        @error="
          ($event.target as HTMLImageElement).src =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSI0MCI+8J+MujwvdGV4dD4KPHN2Zz4='
        "
      />

      <!-- 植宠名称 -->
      <div class="plantmon-name">{{ plantmon.nickname }}</div>
      <div class="plantmon-subtitle">{{ plantmon.common_name }}</div>
      <div class="plantmon-latin">{{ plantmon.latin_name }}</div>

      <!-- 标签页导航 -->
      <div class="tab-navigation">
        <div
          @click="setActiveTab('details')"
          :class="['tab-item', { 'tab-active': activeTab === 'details' }]"
        >
          <div class="tab-text">详情</div>
        </div>
        <div
          @click="setActiveTab('attributes')"
          :class="['tab-item', { 'tab-active': activeTab === 'attributes' }]"
        >
          <div class="tab-text">属性</div>
        </div>
        <div
          @click="setActiveTab('skills')"
          :class="['tab-item', { 'tab-active': activeTab === 'skills' }]"
        >
          <div class="tab-text">技能</div>
        </div>
      </div>

      <!-- 标签页内容区域 -->
      <div class="tab-content">
        <!-- 详情标签页 -->
        <div v-if="activeTab === 'details'" class="details-content">
          <!-- 描述信息 -->
          <div class="description-box">
            <div class="description-text">
              {{ plantmon.description }}
            </div>
          </div>
        </div>

        <!-- 属性标签页 -->
        <div v-if="activeTab === 'attributes'" class="attributes-content">
          <div class="attribute-bars">
            <div v-for="attr in attributeData" :key="attr.name" class="attribute-bar">
              <div class="attribute-icon-wrapper">
                <img
                  :src="`/Pic/elements/${attr.icon}.svg`"
                  :alt="attr.name"
                  class="attribute-icon-img"
                />
              </div>
              <div class="attribute-progress-container">
                <div class="progress-bar-frame">
                  <div v-for="segment in 15" :key="segment" class="progress-segment-wrapper">
                    <div
                      :class="[
                        'progress-segment-rect',
                        segment <= getProgressFill(attr.value) ? 'filled' : 'empty',
                      ]"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 技能标签页 -->
        <div v-if="activeTab === 'skills'" class="skills-content">
          <div class="skills-list">
            <div v-for="skill in plantmon.skills" :key="skill.name" class="skill-item">
              <div class="skill-header">
                <h4 class="skill-name">{{ skill.name }}</h4>
              </div>
              <p class="skill-description">基于植物特性的独特技能</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 固定在底部的出战按钮 -->
      <div class="battle-button-container">
        <button @click="toggleActive" :class="['battle-button', { active: isActive }]">
          {{ isActive ? '已出战' : '确认出战' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 整体容器 */
.screen {
  background-color: #000000;
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: 'DOUYUFont', sans-serif;
  color: #fff;
  /* 背景图像优化 */
  background-attachment: fixed;
}

/* 移动端背景优化 */
@media (max-width: 768px) {
  .screen {
    background-attachment: scroll;
  }
}

/* 错误页面样式 */
.error-container {
  min-height: calc(100vh - 60px); /* 减去导航栏高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.error-content {
  text-align: center;
}

.error-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.error-message {
  font-size: 0.875rem;
  color: #e5e7eb;
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.error-button {
  background-color: #ea580c;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  margin: 0 auto;
  border: none;
  cursor: pointer;
}

.error-button:hover {
  background-color: #dc2626;
}

.error-button-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  filter: brightness(0) invert(1);
}

/* 详情容器 */
.detail-container {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 60px); /* 减去导航栏高度 */
  overflow: hidden;
}

/* 背景图片 */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  z-index: 1;
}

/* 圆形渐变背景 */
.circle-gradient {
  position: absolute;
  top: 60px;
  right: -40px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(36, 134, 42, 0.6), rgba(145, 162, 144, 0));
  opacity: 0.8;
  z-index: 2;
}

/* 半透明容器 */
.content-container {
  position: absolute;
  top: 280px;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 31px 31px 0 0;
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 3;
}

/* 移除原有的顶部导航栏样式，现在使用与IndexView一致的样式 */

.nav-title-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-title {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  text-align: center;
}

/* 等级标识 */
.rarity-badge {
  position: absolute;
  top: 295px;
  left: 40px;
  height: 24px;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, #fffa76 0%, #ff9e55 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
  text-align: left;
}

/* 植宠图片 */
.plantmon-image {
  position: absolute;
  top: 10px;
  left: 40px;
  width: 450px;
  height: 450px;
  object-fit: contain;
  z-index: 9;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* 植宠名称 */
.plantmon-name {
  position: absolute;
  top: 325px;
  left: 40px;
  font-family: 'DOUYUFont', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1.5px;
  line-height: 30px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  z-index: 10;
  text-align: left;
  white-space: nowrap;
}

.plantmon-subtitle {
  position: absolute;
  top: 360px;
  left: 40px;
  font-family: 'Roboto Mono', 'Consolas', monospace;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.5px;
  color: #a8b3a8;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  z-index: 10;
  text-align: left;
  white-space: nowrap;
}

.plantmon-latin {
  position: absolute;
  top: 385px;
  left: 40px;
  font-family: 'Roboto Mono', 'Consolas', monospace;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.3px;
  color: #8b9688;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  z-index: 10;
  text-align: left;
  white-space: nowrap;
  font-style: italic;
}

/* 标签页导航 */
.tab-navigation {
  position: absolute;
  top: 420px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 36px;
  display: flex;
  justify-content: center;
  gap: 20px;
  z-index: 10;
}

.tab-item {
  position: relative;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  cursor: pointer;
  min-width: 80px;
}

.tab-text {
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.78px;
  line-height: 18px;
  text-transform: uppercase;
  color: #757575;
  transition: color 0.2s;
  text-align: center;
}

.tab-active .tab-text {
  color: #fff;
}

.tab-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #fff;
}

/* 标签页内容 */
.tab-content {
  position: absolute;
  top: 460px;
  left: 20px;
  right: 20px;
  bottom: 80px;
  z-index: 10;
  overflow-y: auto;
}

/* 详情内容 */
.details-content {
  padding: 20px;
}

.action-button {
  display: block;
  margin: 0 auto 20px;
  padding: 12px 24px;
  background: linear-gradient(180deg, #b5ff00 0%, #7cb800 100%);
  border: 1px solid #b5ff00;
  border-radius: 8px;
  color: #000;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button.active {
  background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
  border-color: #22c55e;
  color: #fff;
}

.description-box {
  background-color: rgba(10, 9, 13, 0.8);
  border: 1px solid #b5ff00;
  border-radius: 14px;
  padding: 16px;
}

.description-text {
  font-size: 16px;
  letter-spacing: 0.04em;
  line-height: 22px;
  color: #fff;
  font-family: 'Roboto', sans-serif;
}

/* 属性内容 */
.attributes-content {
  padding: 20px 25px;
}

.attribute-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attribute-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.attribute-icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attribute-icon-img {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.attribute-progress-container {
  flex: 1;
}

.progress-bar-frame {
  align-items: center;
  display: inline-flex;
  position: relative;
  height: 20px;
  gap: 2px;
}

.progress-segment-wrapper {
  height: 20px;
  position: relative;
  width: 16px;
}

.progress-segment-rect {
  height: 20px;
  position: absolute;
  width: 16px;
  border-radius: 8px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  top: 0;
  left: 0;
}

.progress-segment-rect.filled {
  background: linear-gradient(
    135deg,
    #ff9e55 0%,
    #5de5ed 25%,
    #7be76c 50%,
    #fffd6d 75%,
    #ff9e55 100%
  );

  /* 添加光泽效果 */
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-segment-rect.empty {
  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);

  /* 暗色效果 */
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.3),
    0 1px 1px rgba(255, 255, 255, 0.05);

  /* 暗色边框 */
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* 技能内容 */
.skills-content {
  padding: 20px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  background-color: rgba(55, 65, 81, 0.5);
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 16px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.skill-damage {
  padding: 2px 8px;
  background-color: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  font-size: 12px;
  border-radius: 9999px;
}

.skill-description {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.5;
}

/* 固定在底部的出战按钮 */
.battle-button-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  z-index: 10;
}

.battle-button {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(180deg, #b5ff00 0%, #7cb800 100%);
  border: 1px solid #b5ff00;
  border-radius: 8px;
  color: #000;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.battle-button.active {
  background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
  border-color: #22c55e;
  color: #fff;
}

.battle-button-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  filter: brightness(0) invert(1);
}

/* 响应式调整 */
@media (max-width: 375px) {
  .tab-navigation {
    width: 280px;
    gap: 15px;
  }

  .tab-item {
    padding: 8px 15px;
    min-width: 70px;
  }

  .battle-button-container {
    width: 260px;
  }

  .rarity-badge {
    left: 20px;
  }

  .plantmon-name {
    left: 20px;
  }

  .plantmon-subtitle {
    left: 20px;
  }

  .plantmon-latin {
    left: 20px;
  }

  .plantmon-image {
    right: 20px;
    width: 160px;
    height: 160px;
  }

  .circle-gradient {
    right: -60px;
    width: 280px;
    height: 280px;
  }
}
</style>
