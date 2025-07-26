// 植宠类型定义 - 根据API文档更新
export interface Plantmon {
  id: string // 唯一ID，如 "#001"
  latin_name: string // 植物拉丁名（API返回的主要标识）
  nickname: string // 基于植物的幻想生物昵称
  common_name: string // 植物的常用中文名
  rarity: 'common' | 'uncommon' | 'rare' // 稀有度：常见、少见、珍稀
  trait: string // 四个字的特性描述
  description: string // 科普介绍和幻想生物描述
  skills: Skill[] // 技能列表
  stats: PlantmonStats // 属性数值
  image_url?: string // 生成的图片URL
  no_bg_image_url?: string // 去背图片URL
  isActive: boolean // 是否为当前出战植宠（前端状态）
  created_at?: string // 创建时间
  updated_at?: string // 更新时间
}

// 植宠属性数值
export interface PlantmonStats {
  hp: number // 生命值 0-100
  attack: number // 攻击力 0-100
  defense: number // 防御力 0-100
  evasion: number // 闪避 0-100
  speed: number // 速度 0-100
}

// 技能类型定义
export interface Skill {
  name: string // 技能名称（不超过4个字）
}

// 植物识别结果
export interface PlantIdentification {
  latin_name: string
  common_name: string
  confidence: number
  plant_part: string
}

// 拍照识别结果类型
export interface CaptureResult {
  success: boolean // 是否识别成功
  message: string // 响应消息
  name?: string // 植物名称
  plant_identification?: PlantIdentification // 植物识别信息
  image_url?: string // 生成的图片URL
  no_bg_image_url?: string // 去背图片URL
  profile_json?: Plantmon // 植宠档案数据
  from_database: boolean // 是否来自数据库缓存
  error?: string // 错误信息
}

// API响应基础类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 植物列表响应
export interface PlantsListResponse {
  success: boolean
  count: number
  latin_names: string[]
}

// 植物详情响应
export interface PlantDetailResponse {
  success: boolean
  data: {
    latin_name: string
    image_url: string
    no_bg_image_url: string
    profile: Plantmon
    created_at: string
    updated_at: string
  }
}

// 健康检查响应
export interface HealthResponse {
  status: string
  service: string
}
