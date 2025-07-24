'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import Image from 'next/image';

export default function IndexPage() {
  const { state } = useGame();
  const router = useRouter();

  // 返回首页
  const handleGoBack = () => {
    router.push('/');
  };

  // 跳转到详情页
  const handlePlantmonClick = (id: string) => {
    router.push(`/detail/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">返回</span>
          </motion.button>
          
          <h1 className="text-2xl font-bold text-gray-800">植宠图鉴</h1>
          
          <div className="w-16"></div> {/* 占位符保持居中 */}
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4">
        {state.plantmons.length === 0 ? (
          // 空状态
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-lg"
            >
              <span className="text-6xl">📚</span>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              图鉴空空如也
            </h2>
            
            <p className="text-gray-500 mb-8 max-w-sm">
              还没有捕获任何植宠呢！快去拍照捕获你的第一只植宠吧！
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/capture')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                         text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">📸</span>
                <span>开始捕获</span>
              </div>
            </motion.button>
          </motion.div>
        ) : (
          // 植宠网格
          <div className="max-w-6xl mx-auto">
            {/* 统计信息 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">已收集</p>
                  <p className="text-2xl font-bold text-gray-800">{state.plantmons.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">出战中</p>
                  <p className="text-lg font-semibold text-green-600">
                    {state.activePlantmon?.name || '未设置'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 植宠网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {state.plantmons.map((plantmon, index) => (
                <motion.div
                  key={plantmon.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlantmonClick(plantmon.id)}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-lg 
                             transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* 出战标识 */}
                  {plantmon.isActive && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        出战中
                      </div>
                    </div>
                  )}

                  {/* 植宠图片 */}
                  <div className="aspect-square relative mb-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={plantmon.image}
                      alt={plantmon.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* 植宠信息 */}
                  <div className="text-center">
                    <h3 className="font-bold text-gray-800 mb-1 truncate">
                      {plantmon.name}
                    </h3>
                    
                    {/* 属性标签 */}
                    <div className="flex flex-wrap justify-center gap-1 mb-2">
                      {plantmon.attributes.slice(0, 2).map((attr) => (
                        <span
                          key={attr}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            attr === 'fire' ? 'bg-red-100 text-red-600' :
                            attr === 'water' ? 'bg-blue-100 text-blue-600' :
                            attr === 'grass' ? 'bg-green-100 text-green-600' :
                            attr === 'electric' ? 'bg-yellow-100 text-yellow-600' :
                            attr === 'flying' ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {attr === 'fire' ? '火' :
                           attr === 'water' ? '水' :
                           attr === 'grass' ? '草' :
                           attr === 'electric' ? '电' :
                           attr === 'flying' ? '飞' :
                           attr === 'ground' ? '地' : attr}
                        </span>
                      ))}
                    </div>

                    {/* HP条 */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(plantmon.hp / plantmon.maxHp) * 100}%` }}
                      />
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      HP: {plantmon.hp}/{plantmon.maxHp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 底部添加按钮 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/capture')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                           text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📸</span>
                  <span>捕获更多植宠</span>
                </div>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 