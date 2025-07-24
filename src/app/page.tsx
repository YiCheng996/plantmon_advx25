'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';

export default function HomePage() {
  const { state } = useGame();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 处理拍照按钮点击
  const handleCaptureClick = () => {
    router.push('/capture');
  };

  // 处理图鉴按钮点击
  const handleIndexClick = () => {
    router.push('/index');
  };

  // 处理对战按钮点击
  const handleBattleClick = () => {
    if (!state.activePlantmon) {
      alert('请先设置一只植宠为出战状态！');
      return;
    }
    router.push('/battle');
  };

  return (
    <div className="mobile-screen relative overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/scenes/背景.png"
          alt="游戏背景"
          fill
          className="object-cover"
          priority
        />
        {/* 背景遮罩 */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 flex flex-col h-full">
        {/* 头部Logo区域 - 适配刘海屏 */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center pt-4 pb-2 safe-area-top"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <h1 className="text-3xl font-bold text-white text-center drop-shadow-lg px-4">
            🌱 Plantmon 🌱
          </h1>
        </motion.div>

        {/* 植宠展示区 - 优化移动端显示 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex items-center justify-center px-4 py-2 min-h-0"
        >
          <div className="w-72 h-72 max-w-[80vw] max-h-[40vh] relative">
            {state.activePlantmon ? (
              // 有植宠状态
              <div className="w-full h-full relative">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={state.activePlantmon.image}
                    alt={state.activePlantmon.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>
                
                {/* 植宠名称 */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mx-auto max-w-fit">
                    <p className="text-base font-semibold text-gray-800 text-center whitespace-nowrap">
                      {state.activePlantmon.name}
                    </p>
                  </div>
                </motion.div>
              </div>
            ) : (
              // 无植宠状态
              <div className="w-full h-full flex flex-col items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6"
                >
                  <span className="text-5xl">🌱</span>
                </motion.div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg mx-4 max-w-xs">
                  <p className="text-base font-semibold text-gray-800 text-center">
                    快去捕获你的第一只植宠吧！
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 底部导航按钮 - 移动端优化 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pb-4 px-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex justify-center space-x-4 max-w-sm mx-auto">
            {/* 拍照/捕获按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCaptureClick}
              disabled={isLoading}
              className="mobile-button flex-1 bg-gradient-to-r from-green-500 to-emerald-600 active:from-green-600 active:to-emerald-700 
                         text-white font-bold py-4 px-4 rounded-2xl shadow-lg transform transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed touchable"
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl">📸</span>
                <span className="text-sm font-medium">
                  {isLoading ? '捕获中...' : '魔力捕获'}
                </span>
              </div>
            </motion.button>

            {/* 图鉴按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleIndexClick}
              className="mobile-button flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 active:from-blue-600 active:to-indigo-700 
                         text-white font-bold py-4 px-4 rounded-2xl shadow-lg transform transition-all duration-200 touchable"
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl">📚</span>
                <span className="text-sm font-medium">图鉴</span>
              </div>
            </motion.button>

            {/* 对战按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBattleClick}
              className="mobile-button flex-1 bg-gradient-to-r from-red-500 to-pink-600 active:from-red-600 active:to-pink-700 
                         text-white font-bold py-4 px-4 rounded-2xl shadow-lg transform transition-all duration-200 touchable"
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl">⚔️</span>
                <span className="text-sm font-medium">对战</span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
