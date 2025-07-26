// 图片工具函数
import type { Plantmon } from '@/types/plantmon'

/**
 * 获取植宠显示图片URL
 * 优先级：去背图片 > 原始图片 > 默认图片
 */
export function getPlantmonImageUrl(
  plantmon: Plantmon | null,
  defaultUrl: string = '/Pic/scenes/starrole.webp',
): string {
  if (!plantmon) return defaultUrl

  // 优先使用去背图片
  if (plantmon.no_bg_image_url) {
    console.log(`使用去背图片: ${plantmon.no_bg_image_url}`)
    return plantmon.no_bg_image_url
  }

  // 其次使用原始图片
  if (plantmon.image_url) {
    console.log(`使用原始图片: ${plantmon.image_url}`)
    return plantmon.image_url
  }

  // 最后使用默认图片
  console.log(`使用默认图片: ${defaultUrl}`)
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
