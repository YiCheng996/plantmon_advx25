'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { mockPlantmons } from '@/lib/mockData';

export default function CapturePage() {
  const router = useRouter();
  const { dispatch } = useGame();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 启动摄像头
  const startCamera = useCallback(async () => {
    try {
      setError('');
      
      // 基本环境检查
      if (typeof window === 'undefined') {
        throw new Error('服务端环境不支持摄像头');
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('当前浏览器不支持摄像头功能，请使用现代浏览器或更新浏览器版本');
      }
      
      // 移动端摄像头配置
      const constraints: MediaStreamConstraints = {
        video: {
          // 优先使用后置摄像头（环境摄像头）
          facingMode: { ideal: 'environment' },
          // 设置合适的分辨率，平衡质量和性能
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      };

      // 请求摄像头权限
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // 设置视频属性
        videoRef.current.setAttribute('playsinline', 'true'); // iOS Safari必需
        videoRef.current.setAttribute('webkit-playsinline', 'true'); // 旧版iOS Safari
        videoRef.current.muted = true; // 防止自动播放被阻止
        
        // 等待视频元数据加载完成
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve();
          }
        });
        
        await videoRef.current.play();
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('摄像头启动失败:', err);
      
      // 提供友好的错误信息
      const error = err as Error;
      if (error.name === 'NotAllowedError') {
        setError('请允许访问摄像头权限，然后刷新页面重试');
      } else if (error.name === 'NotFoundError') {
        setError('未找到可用的摄像头设备');
      } else if (error.name === 'NotSupportedError') {
        setError('当前浏览器不支持摄像头功能');
      } else if (error.name === 'NotReadableError') {
        setError('摄像头被其他应用占用，请关闭其他应用后重试');
      } else if (error.name === 'OverconstrainedError') {
        setError('摄像头不支持所请求的配置，尝试使用默认设置');
        // 尝试使用更简单的配置重试
        try {
          const simpleConstraints: MediaStreamConstraints = {
            video: true,
            audio: false
          };
          const mediaStream = await navigator.mediaDevices.getUserMedia(simpleConstraints);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.setAttribute('playsinline', 'true');
            videoRef.current.setAttribute('webkit-playsinline', 'true');
            videoRef.current.muted = true;
            await videoRef.current.play();
            setStream(mediaStream);
            setIsStreaming(true);
            setError(''); // 清除错误
          }
        } catch {
          setError('摄像头配置失败，请检查设备权限');
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('摄像头启动失败，请检查设备权限设置');
      }
    }
  }, []);

  // 停止摄像头
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStreaming(false);
  }, [stream]);

  // 拍照功能
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) throw new Error('无法获取Canvas上下文');

      // 设置画布尺寸与视频相同
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 绘制当前视频帧到画布
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 转换为图片数据
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // 模拟AI识别过程（实际项目中这里会调用AI API）
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 随机生成一只植宠
      const randomPlantmon = mockPlantmons[Math.floor(Math.random() * mockPlantmons.length)];
      const newPlantmon = {
        ...randomPlantmon,
        id: Date.now().toString(),
        capturedAt: new Date(),
        image: randomPlantmon.image // 在实际项目中，这里会是处理后的图片
      };

      // 添加到收藏
      dispatch({ type: 'ADD_PLANTMON', payload: newPlantmon });

      // 停止摄像头
      stopCamera();

      // 显示捕获成功动画
      setTimeout(() => {
        router.push(`/detail/${newPlantmon.id}`);
      }, 1000);

    } catch (err) {
      console.error('拍照失败:', err);
      setError('拍照失败，请重试');
    } finally {
      setIsCapturing(false);
    }
  }, [isStreaming, dispatch, stopCamera, router]);

  // 组件挂载时启动摄像头
  useEffect(() => {
    startCamera();
    
    // 清理函数
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // 返回主页
  const handleGoBack = () => {
    stopCamera();
    router.push('/');
  };

  return (
    <div className="mobile-screen relative overflow-hidden bg-black">
      {/* 摄像头视频流 */}
      {isStreaming && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
      )}

      {/* 隐藏的画布用于拍照 */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* 错误提示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 mx-4 max-w-sm"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                摄像头访问失败
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {error}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={startCamera}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium"
                >
                  重试
                </button>
                <button
                  onClick={handleGoBack}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium"
                >
                  返回
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 捕获中遮罩 */}
      {isCapturing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-20"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-white text-lg font-semibold">
              🔍 AI识别中...
            </p>
          </div>
        </motion.div>
      )}

      {/* 顶部控制栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 safe-area-top">
        <div className="flex justify-between items-center p-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            <p className="text-sm font-medium">魔力捕获模式</p>
          </div>

          {/* 切换摄像头按钮（如果设备支持多个摄像头） */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // 这里可以实现前后摄像头切换
              console.log('切换摄像头');
            }}
            className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* 底部拍照控制区 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 safe-area-bottom">
        <div className="flex justify-center items-center p-6">
          {/* 拍照按钮 */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={capturePhoto}
            disabled={!isStreaming || isCapturing}
            className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              {isCapturing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.65-.07-.97l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.32-.07.65-.07.97c0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.63Z"/>
                </svg>
              )}
            </div>
          </motion.button>
        </div>

        {/* 提示文字 */}
        <div className="text-center pb-4">
          <p className="text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
            {isCapturing ? '正在识别植物...' : '对准植物，点击拍照捕获'}
          </p>
        </div>
      </div>

      {/* 取景框 */}
      {isStreaming && !isCapturing && (
        <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-64 h-64 border-2 border-white/70 rounded-lg"
          >
            {/* 四个角的装饰 */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 