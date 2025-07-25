/**
 * 音频服务 - 管理游戏背景音乐
 */
class AudioService {
  private audio: HTMLAudioElement | null = null
  private isInitialized = false
  private isPaused = false
  private userInteractionRequired = false

  /**
   * 初始化音频服务
   */
  init() {
    if (this.isInitialized) return

    // 创建音频实例
    this.audio = new Audio('/sound/homepage.wav')
    this.audio.loop = true // 设置循环播放
    this.audio.volume = 0.5 // 设置音量为50%
    this.audio.preload = 'auto' // 预加载音频

    // 监听音频事件
    this.audio.addEventListener('canplaythrough', () => {
      console.log('🎵 背景音乐已加载完成')
    })

    this.audio.addEventListener('error', (e) => {
      console.error('❌ 背景音乐加载失败:', e)
    })

    this.audio.addEventListener('play', () => {
      console.log('▶️ 背景音乐开始播放')
    })

    this.audio.addEventListener('pause', () => {
      console.log('⏸️ 背景音乐已暂停')
    })

    // 监听音频结束事件（虽然是循环播放，但作为备用）
    this.audio.addEventListener('ended', () => {
      if (!this.isPaused) {
        this.play()
      }
    })

    this.isInitialized = true
  }

  /**
   * 播放背景音乐
   */
  async play() {
    if (!this.audio) {
      this.init()
    }

    // 如果已暂停，不播放
    if (this.isPaused) return

    try {
      if (this.audio) {
        await this.audio.play()
        this.userInteractionRequired = false
      }
    } catch (error) {
      console.warn('⚠️ 自动播放被浏览器阻止，将在用户交互时自动播放:', error)
      this.userInteractionRequired = true
      // 浏览器阻止自动播放时，静默等待用户交互
      this.setupUserInteractionListener()
    }
  }

  /**
   * 暂停背景音乐
   */
  pause() {
    if (this.audio) {
      this.audio.pause()
      this.isPaused = true
    }
  }

  /**
   * 恢复播放
   */
  resume() {
    if (this.audio && this.isPaused) {
      this.isPaused = false
      this.play()
    }
  }

  /**
   * 设置音量 (0-1)
   */
  setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume))
      console.log(`🔊 音量设置为: ${Math.round(volume * 100)}%`)
    }
  }

  /**
   * 获取当前音量
   */
  getVolume(): number {
    return this.audio?.volume || 0.5
  }

  /**
   * 获取当前是否正在播放
   */
  isPlaying(): boolean {
    return this.audio ? !this.audio.paused && !this.audio.ended : false
  }

  /**
   * 检查是否需要用户交互
   */
  needsUserInteraction(): boolean {
    return this.userInteractionRequired
  }

  /**
   * 设置用户交互监听器，用于处理浏览器自动播放限制
   */
  private setupUserInteractionListener() {
    const playOnInteraction = () => {
      if (this.audio && !this.isPaused) {
        this.audio
          .play()
          .then(() => {
            console.log('🎉 用户交互后背景音乐开始播放')
            this.userInteractionRequired = false
            // 移除事件监听器
            document.removeEventListener('click', playOnInteraction)
            document.removeEventListener('touchstart', playOnInteraction)
            document.removeEventListener('keydown', playOnInteraction)
          })
          .catch(console.error)
      }
    }

    // 监听用户交互事件
    document.addEventListener('click', playOnInteraction, { once: true })
    document.addEventListener('touchstart', playOnInteraction, { once: true })
    document.addEventListener('keydown', playOnInteraction, { once: true })
  }

  /**
   * 销毁音频服务
   */
  destroy() {
    if (this.audio) {
      this.audio.pause()
      this.audio.src = ''
      this.audio = null
    }
    this.isInitialized = false
    this.isPaused = false
    this.userInteractionRequired = false
  }
}

// 创建单例实例
export const audioService = new AudioService()
