import { defineStore } from 'pinia'
import type { Plantmon } from '@/types/plantmon'
import ApiService from '@/services/apiService'

// Store状态接口
interface PlantmonState {
  // 所有植宠列表
  plantmons: Plantmon[]
  // 当前出战植宠的拉丁名称
  activePlantmonLatinName: string | null
  // 加载状态
  loading: {
    plantsList: boolean
    plantDetail: boolean
    processImage: boolean
    healthCheck: boolean
  }
  // 错误状态
  errors: {
    plantsList: string | null
    plantDetail: string | null
    processImage: string | null
    healthCheck: string | null
  }
  // 服务健康状态
  serviceHealthy: boolean
}

export const usePlantmonStore = defineStore('plantmon', {
  state: (): PlantmonState => ({
    plantmons: [],
    activePlantmonLatinName: null,
    loading: {
      plantsList: false,
      plantDetail: false,
      processImage: false,
      healthCheck: false,
    },
    errors: {
      plantsList: null,
      plantDetail: null,
      processImage: null,
      healthCheck: null,
    },
    serviceHealthy: false,
  }),

  getters: {
    // 获取当前出战的植宠
    activePlantmon: (state) => {
      return state.plantmons.find((p) => p.latin_name === state.activePlantmonLatinName) || null
    },

    // 获取植宠总数
    totalCount: (state) => state.plantmons.length,

    // 根据拉丁名称获取植宠
    getPlantmonByLatinName: (state) => {
      return (latinName: string) => state.plantmons.find((p) => p.latin_name === latinName)
    },

    // 根据ID获取植宠（兼容旧版本）
    getPlantmonById: (state) => {
      return (id: string) => state.plantmons.find((p) => p.id === id)
    },

    // 检查是否有任何加载中的状态
    isLoading: (state) => {
      return Object.values(state.loading).some((loading) => loading)
    },

    // 检查是否有任何错误
    hasErrors: (state) => {
      return Object.values(state.errors).some((error) => error !== null)
    },
  },

  actions: {
    // 清除指定类型的错误
    clearError(type: keyof PlantmonState['errors']) {
      this.errors[type] = null
    },

    // 清除所有错误
    clearAllErrors() {
      Object.keys(this.errors).forEach((key) => {
        this.errors[key as keyof PlantmonState['errors']] = null
      })
    },

    // 健康检查
    async checkHealth() {
      this.loading.healthCheck = true
      this.errors.healthCheck = null

      try {
        const response = await ApiService.healthCheck()
        this.serviceHealthy = response.status === 'healthy'
        console.log('服务健康状态:', response)
      } catch (error) {
        this.serviceHealthy = false
        this.errors.healthCheck = error instanceof Error ? error.message : '健康检查失败'
        console.error('健康检查失败:', error)
      } finally {
        this.loading.healthCheck = false
      }
    },

    // 从API加载所有植宠数据
    async loadPlantsFromAPI() {
      this.loading.plantsList = true
      this.errors.plantsList = null

      try {
        // 1. 获取植物列表
        const plantsListResponse = await ApiService.getPlantsList()

        if (!plantsListResponse.success) {
          throw new Error('获取植物列表失败')
        }

        // 2. 批量获取植物详情
        const plantDetails = await ApiService.getBatchPlantDetails(plantsListResponse.latin_names)

        // 3. 转换为Plantmon格式
        this.plantmons = plantDetails
          .filter((detail) => detail.success) // 只保留成功获取的数据
          .map((detail, index) => {
            const profile = detail.data.profile
            return {
              ...profile,
              id: `#${String(index + 1).padStart(3, '0')}`, // 生成ID格式如 #001
              image_url: detail.data.image_url,
              no_bg_image_url: detail.data.no_bg_image_url,
              isActive: false, // 初始都不是出战状态
              created_at: detail.data.created_at,
              updated_at: detail.data.updated_at,
            }
          })

        // 4. 如果有植宠且没有设置出战植宠，设置第一只为出战
        if (this.plantmons.length > 0 && !this.activePlantmonLatinName) {
          this.setActivePlantmon(this.plantmons[0].latin_name)
        }

        console.log(`成功加载 ${this.plantmons.length} 只植宠`)
      } catch (error) {
        this.errors.plantsList = error instanceof Error ? error.message : '加载植宠数据失败'
        console.error('加载植宠数据失败:', error)
      } finally {
        this.loading.plantsList = false
      }
    },

    // 根据拉丁名称获取植宠详情
    async getPlantmonDetail(latinName: string) {
      this.loading.plantDetail = true
      this.errors.plantDetail = null

      try {
        const response = await ApiService.getPlantDetail(latinName)

        if (!response.success) {
          throw new Error(`获取植宠详情失败: ${latinName}`)
        }

        return response.data
      } catch (error) {
        this.errors.plantDetail = error instanceof Error ? error.message : '获取植宠详情失败'
        console.error('获取植宠详情失败:', error)
        throw error
      } finally {
        this.loading.plantDetail = false
      }
    },

    // 处理植物图片（拍照识别）
    async processPlantImage(imageFile: File) {
      this.loading.processImage = true
      this.errors.processImage = null

      try {
        const result = await ApiService.processPlantImage(imageFile)

        if (!result.success) {
          throw new Error(result.error || '图片处理失败')
        }

        // 如果是新植宠，添加到列表中
        if (result.profile_json && !result.from_database) {
          const newPlantmon: Plantmon = {
            ...result.profile_json,
            id: `#${String(this.plantmons.length + 1).padStart(3, '0')}`,
            image_url: result.image_url,
            no_bg_image_url: result.no_bg_image_url,
            isActive: false,
          }

          this.addPlantmon(newPlantmon)
        }

        return result
      } catch (error) {
        this.errors.processImage = error instanceof Error ? error.message : '图片处理失败'
        console.error('图片处理失败:', error)
        throw error
      } finally {
        this.loading.processImage = false
      }
    },

    // 添加新植宠
    addPlantmon(plantmon: Plantmon) {
      // 检查是否已存在相同拉丁名称的植宠
      const existingIndex = this.plantmons.findIndex((p) => p.latin_name === plantmon.latin_name)

      if (existingIndex >= 0) {
        // 如果已存在，更新数据
        this.plantmons[existingIndex] = {
          ...plantmon,
          isActive: this.plantmons[existingIndex].isActive,
        }
      } else {
        // 如果不存在，添加新植宠
        this.plantmons.push(plantmon)
      }

      // 如果是第一只植宠，自动设为出战
      if (this.plantmons.length === 1) {
        this.setActivePlantmon(plantmon.latin_name)
      }
    },

    // 设置出战植宠
    setActivePlantmon(latinName: string) {
      // 取消之前的出战状态
      this.plantmons.forEach((p) => (p.isActive = false))

      // 设置新的出战植宠
      const plantmon = this.plantmons.find((p) => p.latin_name === latinName)
      if (plantmon) {
        plantmon.isActive = true
        this.activePlantmonLatinName = latinName
      }
    },

    // 初始化 - 检查健康状态并加载数据
    async initialize() {
      console.log('初始化植宠数据...')

      // 先检查服务健康状态
      await this.checkHealth()

      // 如果服务健康，加载植宠数据
      if (this.serviceHealthy) {
        await this.loadPlantsFromAPI()
      } else {
        console.warn('后端服务不可用，使用模拟数据')
        this.initMockData()
      }
    },

    // 初始化模拟数据（后端不可用时的备用方案）
    initMockData() {
      const mockPlantmons: Plantmon[] = [
        {
          id: '#001',
          latin_name: 'Rosa damascena',
          nickname: '神秘守护者',
          common_name: '大马士革玫瑰',
          rarity: 'rare',
          trait: '神秘守护',
          description:
            '拥有神秘力量的守护者，能够保护队友免受伤害。传说中它来自远古的神殿，是光明与正义的象征。对应的宝可梦是神秘守护者',
          skills: [{ name: '神圣护盾' }, { name: '光芒冲击' }],
          stats: {
            hp: 85,
            attack: 75,
            defense: 90,
            evasion: 60,
            speed: 70,
          },
          image_url: '/Pic/roles/20250724-183408.png',
          no_bg_image_url: '/Pic/roles/20250724-183408.png', // 添加去背图片URL
          isActive: false,
        },
        {
          id: '#002',
          latin_name: 'Aloe vera',
          nickname: '森林精灵',
          common_name: '芦荟',
          rarity: 'uncommon',
          trait: '自然治愈',
          description:
            '栖息在深林中的精灵，与大自然和谐共生。它能感知植物的声音，是森林的忠实守护者。对应的宝可梦是森林精灵',
          skills: [{ name: '自然治愈' }, { name: '荆棘缠绕' }],
          stats: {
            hp: 70,
            attack: 55,
            defense: 65,
            evasion: 80,
            speed: 75,
          },
          image_url: '/Pic/roles/20250724-183436.png',
          no_bg_image_url: '/Pic/roles/20250724-183436.png', // 添加去背图片URL
          isActive: false,
        },
      ]

      this.plantmons = mockPlantmons
      // 设置第一只为出战状态
      if (mockPlantmons.length > 0) {
        this.setActivePlantmon(mockPlantmons[0].latin_name)
      }
    },
  },
})
