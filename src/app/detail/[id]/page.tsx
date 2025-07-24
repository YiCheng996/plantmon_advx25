'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import Image from 'next/image';

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default function DetailPage({ params }: DetailPageProps) {
  const { state, setActivePlantmon, removeActivePlantmon } = useGame();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'attributes' | 'skills' | 'story'>('attributes');

  // 根据ID查找植宠
  const plantmon = state.plantmons.find(p => p.id === params.id);

  // 如果找不到植宠，显示错误页面
  if (!plantmon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">植宠未找到</h1>
          <p className="text-gray-600 mb-6">这只植宠可能已经不存在了</p>
          <button
            onClick={() => router.push('/index')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            返回图鉴
          </button>
        </div>
      </div>
    );
  }

  // 处理设为出战
  const handleToggleActive = () => {
    if (plantmon.isActive) {
      removeActivePlantmon();
    } else {
      setActivePlantmon(plantmon.id);
    }
  };

  // 返回图鉴页
  const handleGoBack = () => {
    router.push('/index');
  };

  // 获取属性背景色
  const getAttributeBackground = (attr: string) => {
    switch (attr) {
      case 'fire': return 'from-red-400 to-orange-500';
      case 'water': return 'from-blue-400 to-cyan-500';
      case 'grass': return 'from-green-400 to-emerald-500';
      case 'electric': return 'from-yellow-400 to-amber-500';
      case 'flying': return 'from-purple-400 to-violet-500';
      case 'ground': return 'from-amber-600 to-yellow-700';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
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
          
          <h1 className="text-xl font-bold text-gray-800">植宠详情</h1>
          
          <div className="w-16"></div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* 植宠基本信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-6"
        >
          {/* 出战状态标识 */}
          {plantmon.isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 z-10"
            >
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ⚔️ 出战中
              </div>
            </motion.div>
          )}

          <div className="text-center">
            {/* 植宠图片 */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-48 h-48 mx-auto mb-6 relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${getAttributeBackground(plantmon.attributes[0])} rounded-full opacity-20`} />
              <Image
                src={plantmon.image}
                alt={plantmon.name}
                fill
                className="object-contain p-4 drop-shadow-lg"
              />
            </motion.div>

            {/* 基本信息 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {plantmon.name}
              </h2>
              
              <p className="text-gray-600 mb-4">
                #{plantmon.id.slice(-4).toUpperCase()}
              </p>

              {/* HP条 */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>生命值</span>
                  <span>{plantmon.hp}/{plantmon.maxHp}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(plantmon.hp / plantmon.maxHp) * 100}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                  />
                </div>
              </div>

              {/* 设为出战按钮 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleActive}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                  plantmon.isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                }`}
              >
                {plantmon.isActive ? '✓ 当前出战' : '设为出战'}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* 详细信息选项卡 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden"
        >
          {/* 选项卡头部 */}
          <div className="flex border-b border-gray-200">
            {[
              { key: 'attributes', label: '属性', icon: '⚡' },
              { key: 'skills', label: '技能', icon: '🎯' },
              { key: 'story', label: '介绍', icon: '📖' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-4 px-4 font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* 选项卡内容 */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'attributes' && (
                <motion.div
                  key="attributes"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">属性类型</h3>
                  <div className="flex flex-wrap gap-3">
                    {plantmon.attributes.map((attr, index) => (
                      <motion.div
                        key={attr}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-r ${getAttributeBackground(attr)} text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg`}
                      >
                        {attr === 'fire' ? '🔥 火系' :
                         attr === 'water' ? '💧 水系' :
                         attr === 'grass' ? '🌿 草系' :
                         attr === 'electric' ? '⚡ 电系' :
                         attr === 'flying' ? '🦅 飞行系' :
                         attr === 'ground' ? '🗿 地面系' : attr}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">技能列表</h3>
                  <div className="space-y-4">
                    {plantmon.skills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-2xl p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800">{skill.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              skill.attribute === 'fire' ? 'bg-red-100 text-red-600' :
                              skill.attribute === 'water' ? 'bg-blue-100 text-blue-600' :
                              skill.attribute === 'grass' ? 'bg-green-100 text-green-600' :
                              skill.attribute === 'electric' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {skill.attribute}
                            </span>
                            <span className="font-bold text-orange-600">{skill.damage} 伤害</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{skill.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'story' && (
                <motion.div
                  key="story"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">植宠介绍</h3>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {plantmon.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        捕获时间: {plantmon.capturedAt.toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 