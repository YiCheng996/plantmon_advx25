// 图片工具函数
import type { Plantmon } from '@/types/plantmon'

// API基础URL常量
const API_BASE_URL = 'https://plantmonapi.zeabur.app'

/**
 * 转换图片URL，将localhost替换为生产环境地址
 * @param url 原始图片URL
 * @returns 转换后的图片URL
 */
export function transformImageUrl(url: string): string {
  if (!url) return url

  // 如果URL包含localhost，替换为生产环境地址
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // 提取路径部分（/static/images/xxx.png）
    const pathMatch = url.match(/\/static\/images\/.*$/)
    if (pathMatch) {
      return `${API_BASE_URL}${pathMatch[0]}`
    }
  }

  // 如果URL是相对路径，拼接完整地址
  if (url.startsWith('/static/')) {
    return `${API_BASE_URL}${url}`
  }

  // 如果URL已经是完整的https地址，直接返回
  if (url.startsWith('https://')) {
    return url
  }

  // 其他情况直接返回原URL
  return url
}

/**
 * 获取植宠显示图片URL
 * 优先级：去背图片 > 原始图片 > 默认图片
 */
export function getPlantmonImageUrl(
  plantmon: Plantmon | null,
  defaultUrl: string = '/Pic/scenes/starrole.webp',
): string {
  if (!plantmon) {
    console.log('植宠对象为空，使用默认图片')
    return defaultUrl
  }

  // 调试信息：显示植宠的图片URL字段
  console.log('植宠图片字段检查:', {
    nickname: plantmon.nickname,
    no_bg_image_url: plantmon.no_bg_image_url,
    image_url: plantmon.image_url,
    no_bg_exists: !!plantmon.no_bg_image_url,
    image_exists: !!plantmon.image_url,
  })

  // 优先使用去背图片
  if (plantmon.no_bg_image_url) {
    const transformedUrl = transformImageUrl(plantmon.no_bg_image_url)
    console.log(`✅ 使用去背图片: ${transformedUrl}`)
    return transformedUrl
  }

  // 其次使用原始图片
  if (plantmon.image_url) {
    const transformedUrl = transformImageUrl(plantmon.image_url)
    console.log(`⚠️ 使用原始图片（无去背图片）: ${transformedUrl}`)
    return transformedUrl
  }

  // 最后使用默认图片
  console.log(`❌ 使用默认图片（无任何图片URL）: ${defaultUrl}`)
  return defaultUrl
}

/**
 * 检查图片是否为去背图片
 */
export function isNoBgImage(plantmon: Plantmon | null): boolean {
  return !!plantmon?.no_bg_image_url
}

/**
 * 获取图片类型描述
 */
export function getImageTypeDescription(plantmon: Plantmon | null): string {
  if (!plantmon) return '默认角色'

  if (plantmon.no_bg_image_url) return '去背植宠图片'
  if (plantmon.image_url) return '原始植宠图片'
  return '默认角色图片'
}
