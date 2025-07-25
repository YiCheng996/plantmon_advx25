/**
 * API测试工具 - 用于调试和验证API连接
 */

// 测试API连接
export const testApiConnection = async (): Promise<{
  success: boolean
  message: string
  details?: any
}> => {
  try {
    console.log('🧪 开始测试API连接...')

    // 根据环境选择API地址
    const apiUrl = import.meta.env.DEV
      ? '/api/plantmon/process' // 开发环境使用代理
      : 'https://plantmonapi.zeabur.app/process' // 生产环境直接调用

    console.log('📍 测试地址:', apiUrl)

    // 创建一个简单的测试图片（1x1像素的透明PNG）
    const testImageData =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

    // 转换为Blob
    const response = await fetch(testImageData)
    const blob = await response.blob()

    // 创建FormData
    const formData = new FormData()
    formData.append('image', blob, 'test.png')

    console.log('📤 发送测试请求...')

    // 发送请求
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })

    console.log('📡 响应状态:', apiResponse.status)
    console.log('📡 响应头:', Object.fromEntries(apiResponse.headers.entries()))

    if (!apiResponse.ok) {
      throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`)
    }

    const result = await apiResponse.json()
    console.log('✅ API响应:', result)

    return {
      success: true,
      message: 'API连接成功',
      details: {
        status: apiResponse.status,
        data: result,
        url: apiUrl,
      },
    }
  } catch (error) {
    console.error('❌ API测试失败:', error)

    let errorMessage = 'API连接失败'

    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        errorMessage = '网络请求失败 - 可能是CORS问题或网络连接问题'
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS跨域错误 - 代理配置可能有问题'
      } else if (error.message.includes('404')) {
        errorMessage = 'API端点不存在 - 请检查URL配置'
      } else if (error.message.includes('500')) {
        errorMessage = '服务器内部错误'
      } else {
        errorMessage = `请求失败: ${error.message}`
      }
    }

    return {
      success: false,
      message: errorMessage,
      details: error,
    }
  }
}

// 检查代理配置
export const checkProxyConfig = () => {
  const isDev = import.meta.env.DEV
  const apiUrl = isDev ? '/api/plantmon/process' : 'https://plantmonapi.zeabur.app/process'

  console.log('🔧 代理配置检查:')
  console.log('- 环境:', isDev ? '开发环境' : '生产环境')
  console.log('- API地址:', apiUrl)
  console.log('- 基础URL:', window.location.origin)

  return {
    isDev,
    apiUrl,
    baseUrl: window.location.origin,
  }
}
