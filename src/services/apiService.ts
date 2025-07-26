// API服务层 - 封装所有后端接口调用
import { API_CONFIG } from '@/config/api'
import type {
  HealthResponse,
  PlantsListResponse,
  PlantDetailResponse,
  CaptureResult,
  ApiResponse,
} from '@/types/plantmon'

// HTTP请求工具类
class HttpClient {
  private baseURL: string
  private timeout: number

  constructor(baseURL: string, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  // 通用请求方法
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    // 创建AbortController用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('请求超时，请检查网络连接')
        }
        throw new Error(`网络请求失败: ${error.message}`)
      }
      throw new Error('未知网络错误')
    }
  }

  // GET请求
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // POST表单数据
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // 不设置Content-Type，让浏览器自动设置multipart/form-data边界
      },
    })
  }
}

// 创建HTTP客户端实例
const httpClient = new HttpClient(API_CONFIG.BASE_URL)

// API服务类
export class ApiService {
  /**
   * 健康检查 - 检查服务运行状态
   */
  static async healthCheck(): Promise<HealthResponse> {
    try {
      return await httpClient.get<HealthResponse>(API_CONFIG.ENDPOINTS.HEALTH)
    } catch (error) {
      console.error('健康检查失败:', error)
      throw error
    }
  }

  /**
   * 获取所有植物列表 - 获取数据库中已记录的所有植物拉丁名称
   */
  static async getPlantsList(): Promise<PlantsListResponse> {
    try {
      return await httpClient.get<PlantsListResponse>(API_CONFIG.ENDPOINTS.PLANTS)
    } catch (error) {
      console.error('获取植物列表失败:', error)
      throw error
    }
  }

  /**
   * 获取指定植物信息 - 根据拉丁名称获取植物详细信息
   * @param latinName 植物拉丁名称（需要URL编码）
   * @param info 信息类型：'all' | 'profile' | 'no_bg_image_url' | 'image_url'
   */
  static async getPlantDetail(
    latinName: string,
    info: 'all' | 'profile' | 'no_bg_image_url' | 'image_url' = 'all',
  ): Promise<PlantDetailResponse> {
    try {
      // URL编码拉丁名称
      const encodedName = encodeURIComponent(latinName)
      const endpoint = `${API_CONFIG.ENDPOINTS.PLANT_DETAIL}/${encodedName}`
      const queryParam = info !== 'all' ? `?info=${info}` : ''

      return await httpClient.get<PlantDetailResponse>(`${endpoint}${queryParam}`)
    } catch (error) {
      console.error('获取植物详情失败:', error)
      throw error
    }
  }

  /**
   * 处理植物图片 - 上传图片进行识别和生成植宠
   * @param imageFile 植物图片文件
   */
  static async processPlantImage(imageFile: File): Promise<CaptureResult> {
    try {
      // 创建FormData
      const formData = new FormData()
      formData.append('image', imageFile)

      return await httpClient.postFormData<CaptureResult>(API_CONFIG.ENDPOINTS.PROCESS, formData)
    } catch (error) {
      console.error('植物图片处理失败:', error)
      throw error
    }
  }

  /**
   * 批量获取植物详情 - 根据拉丁名称列表获取多个植物的详细信息
   * @param latinNames 拉丁名称数组
   */
  static async getBatchPlantDetails(latinNames: string[]): Promise<PlantDetailResponse[]> {
    try {
      // 并发请求所有植物详情
      const promises = latinNames.map((name) => this.getPlantDetail(name))
      return await Promise.all(promises)
    } catch (error) {
      console.error('批量获取植物详情失败:', error)
      throw error
    }
  }
}

// 导出默认实例
export default ApiService
