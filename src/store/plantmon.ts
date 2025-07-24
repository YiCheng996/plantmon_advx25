import { defineStore } from 'pinia'
import type { Plantmon } from '@/types/plantmon'

export const usePlantmonStore = defineStore('plantmon', {
  state: () => ({
    // 所有植宠列表
    plantmons: [] as Plantmon[],
    // 当前出战植宠ID
    activePlantmonId: null as string | null,
  }),

  getters: {
    // 获取当前出战的植宠
    activePlantmon: (state) => {
      return state.plantmons.find(p => p.id === state.activePlantmonId) || null
    },
    
    // 获取植宠总数
    totalCount: (state) => state.plantmons.length,
    
    // 根据ID获取植宠
    getPlantmonById: (state) => {
      return (id: string) => state.plantmons.find(p => p.id === id)
    },
  },

  actions: {
    // 添加新植宠
    addPlantmon(plantmon: Plantmon) {
      this.plantmons.push(plantmon)
      
      // 如果是第一只植宠，自动设为出战
      if (this.plantmons.length === 1) {
        this.setActivePlantmon(plantmon.id)
      }
    },

    // 设置出战植宠
    setActivePlantmon(id: string) {
      // 取消之前的出战状态
      this.plantmons.forEach(p => p.isActive = false)
      
      // 设置新的出战植宠
      const plantmon = this.plantmons.find(p => p.id === id)
      if (plantmon) {
        plantmon.isActive = true
        this.activePlantmonId = id
      }
    },

    // 初始化模拟数据（用于开发测试）
    initMockData() {
      const mockPlantmons: Plantmon[] = [
        {
          id: '#001',
          name: '神秘守护者',
          image: '/Pic/roles/20250724-183408.png',
          attributes: ['神秘', '守护'],
          skills: [
            { name: '神圣护盾', description: '为自己和队友提供强力护盾保护', damage: 0 },
            { name: '光芒冲击', description: '释放神圣光芒攻击敌人', damage: 35 }
          ],
          description: '拥有神秘力量的守护者，能够保护队友免受伤害。传说中它来自远古的神殿，是光明与正义的象征。',
          isActive: false
        },
        {
          id: '#002',
          name: '森林精灵',
          image: '/Pic/roles/20250724-183436.png',
          attributes: ['自然', '精灵'],
          skills: [
            { name: '自然治愈', description: '利用自然之力恢复生命值', damage: 0 },
            { name: '荆棘缠绕', description: '召唤荆棘藤蔓攻击敌人', damage: 28 }
          ],
          description: '栖息在深林中的精灵，与大自然和谐共生。它能感知植物的声音，是森林的忠实守护者。',
          isActive: false
        },
        {
          id: '#003',
          name: '暗影刺客',
          image: '/Pic/roles/20250724-183440.png',
          attributes: ['暗影', '敏捷'],
          skills: [
            { name: '影遁', description: '隐身于暗影中，下次攻击必定命中', damage: 0 },
            { name: '致命一击', description: '从暗影中发动致命攻击', damage: 45 }
          ],
          description: '行走在黑暗中的神秘存在，动作敏捷如风。它掌握着暗影的力量，是夜晚最危险的猎手。',
          isActive: false
        },
        {
          id: '#004',
          name: '烈焰战士',
          image: '/Pic/roles/20250724-183451.png',
          attributes: ['火焰', '战士'],
          skills: [
            { name: '烈焰冲锋', description: '带着熊熊烈火冲向敌人', damage: 40 },
            { name: '火焰护甲', description: '用火焰包围自己，提高防御力', damage: 0 }
          ],
          description: '身披烈焰的勇敢战士，永不退缩。它的剑刃上燃烧着永恒的火焰，是战场上最耀眼的存在。',
          isActive: false
        },
        {
          id: '#005',
          name: '冰霜法师',
          image: '/Pic/roles/20250724-183509.png',
          attributes: ['冰霜', '法师'],
          skills: [
            { name: '冰霜新星', description: '释放冰霜能量冻结周围敌人', damage: 30 },
            { name: '寒冰护盾', description: '创造冰霜护盾减少受到的伤害', damage: 0 }
          ],
          description: '掌握冰霜魔法的智者，冷静而理智。它能够操控寒冰的力量，将敌人冻结在永恒的冰晶中。',
          isActive: false
        }
      ]
      
      this.plantmons = mockPlantmons
      // 设置第一只为出战状态
      if (mockPlantmons.length > 0) {
        this.setActivePlantmon(mockPlantmons[0].id)
      }
    }
  }
}) 