// 植宠类型定义
export interface Plantmon {
  id: string // 唯一ID，如 "#001"
  name: string // 植宠名称
  image: string // 植宠图片URL
  attributes: string[] // 属性，如 ["火", "飞行系"]
  skills: Skill[] // 技能列表
  description: string // 背景故事或趣味描述
  isActive: boolean // 是否为当前出战植宠
  rarity?: string // 稀有度等级，如 "SSSR", "SSR", "SR", "R", "N"
}

// 技能类型定义
export interface Skill {
  name: string // 技能名称
  description: string // 技能描述
  damage?: number // 伤害值（可选）
}

// 拍照识别结果类型
export interface CaptureResult {
  success: boolean // 是否识别成功
  plantmon?: Plantmon // 成功时返回的植宠数据
  error?: string // 失败时的错误信息
}
