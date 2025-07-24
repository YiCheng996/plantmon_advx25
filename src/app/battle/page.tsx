'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { generateRandomEnemy } from '@/lib/mockData';
import { Plantmon } from '@/types/plantmon';
import Image from 'next/image';

type BattleResult = 'win' | 'lose' | 'ongoing' | null;
type Turn = 'player' | 'enemy';

export default function BattlePage() {
  const { state } = useGame();
  const router = useRouter();
  
  // 战斗状态
  const [playerPlantmon, setPlayerPlantmon] = useState<Plantmon | null>(null);
  const [enemyPlantmon, setEnemyPlantmon] = useState<Plantmon | null>(null);
  const [currentTurn, setCurrentTurn] = useState<Turn>('player');
  const [battleResult, setBattleResult] = useState<BattleResult>('ongoing');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // 初始化战斗
  useEffect(() => {
    if (!state.activePlantmon) {
      // 如果没有出战植宠，返回首页
      router.push('/');
      return;
    }

    // 设置玩家植宠（复制一份避免修改原数据）
    setPlayerPlantmon({ ...state.activePlantmon });
    
    // 生成敌人植宠
    const enemy = generateRandomEnemy();
    setEnemyPlantmon(enemy);
    
    // 添加战斗开始日志
    setBattleLog([
      `野生的${enemy.name}出现了！`,
      `去吧，${state.activePlantmon.name}！`
    ]);
  }, [state.activePlantmon, router]);

  // 检查战斗结果
  useEffect(() => {
    if (!playerPlantmon || !enemyPlantmon) return;

    if (playerPlantmon.hp <= 0) {
      setBattleResult('lose');
      setBattleLog(prev => [...prev, `${playerPlantmon.name}失去了战斗能力！`, '你输了...']);
    } else if (enemyPlantmon.hp <= 0) {
      setBattleResult('win');
      setBattleLog(prev => [...prev, `${enemyPlantmon.name}失去了战斗能力！`, '你赢了！']);
    }
  }, [playerPlantmon?.hp, enemyPlantmon?.hp]);

  // 玩家攻击
  const handlePlayerAttack = async (skillIndex: number) => {
    if (!playerPlantmon || !enemyPlantmon || currentTurn !== 'player' || isAnimating) return;

    setIsAnimating(true);
    const skill = playerPlantmon.skills[skillIndex];
    
    // 计算伤害（添加随机性）
    const baseDamage = skill.damage;
    const randomFactor = 0.8 + Math.random() * 0.4; // 80%-120%
    const damage = Math.floor(baseDamage * randomFactor);
    
    // 更新敌人HP
    const newEnemyHp = Math.max(0, enemyPlantmon.hp - damage);
    setEnemyPlantmon(prev => prev ? { ...prev, hp: newEnemyHp } : null);
    
    // 添加战斗日志
    setBattleLog(prev => [
      ...prev,
      `${playerPlantmon.name}使用了${skill.name}！`,
      `对${enemyPlantmon.name}造成了${damage}点伤害！`
    ]);

    // 等待动画完成
    setTimeout(() => {
      setIsAnimating(false);
      
      // 如果敌人还活着，切换到敌人回合
      if (newEnemyHp > 0) {
        setCurrentTurn('enemy');
        // 敌人自动攻击
        setTimeout(() => handleEnemyAttack(), 1500);
      }
    }, 1000);
  };

  // 敌人攻击
  const handleEnemyAttack = () => {
    if (!playerPlantmon || !enemyPlantmon || battleResult !== 'ongoing') return;

    setIsAnimating(true);
    
    // 敌人随机选择技能
    const skill = enemyPlantmon.skills[Math.floor(Math.random() * enemyPlantmon.skills.length)];
    
    // 计算伤害
    const baseDamage = skill.damage;
    const randomFactor = 0.8 + Math.random() * 0.4;
    const damage = Math.floor(baseDamage * randomFactor);
    
    // 更新玩家HP
    const newPlayerHp = Math.max(0, playerPlantmon.hp - damage);
    setPlayerPlantmon(prev => prev ? { ...prev, hp: newPlayerHp } : null);
    
    // 添加战斗日志
    setBattleLog(prev => [
      ...prev,
      `${enemyPlantmon.name}使用了${skill.name}！`,
      `对${playerPlantmon.name}造成了${damage}点伤害！`
    ]);

    setTimeout(() => {
      setIsAnimating(false);
      
      // 如果玩家还活着，切换到玩家回合
      if (newPlayerHp > 0) {
        setCurrentTurn('player');
      }
    }, 1000);
  };

  // 返回首页
  const handleGoHome = () => {
    router.push('/');
  };

  // 再战一场
  const handleBattleAgain = () => {
    // 重置战斗状态
    if (state.activePlantmon) {
      setPlayerPlantmon({ ...state.activePlantmon });
    }
    setEnemyPlantmon(generateRandomEnemy());
    setCurrentTurn('player');
    setBattleResult('ongoing');
    setBattleLog(['新的战斗开始了！']);
    setIsAnimating(false);
  };

  if (!playerPlantmon || !enemyPlantmon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <p className="text-xl">准备战斗中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/assets/scenes/背景.png"
          alt="战斗背景"
          fill
          className="object-cover"
        />
      </div>

      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleGoHome}
        className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full"
      >
        <span className="text-xl">←</span>
      </motion.button>

      <div className="relative z-10 flex flex-col h-screen">
        {/* 敌人区域 */}
        <div className="flex-1 flex items-end justify-center p-4">
          <motion.div
            animate={isAnimating && currentTurn === 'player' ? { x: [-10, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* 敌人植宠 */}
            <motion.div
              initial={{ scale: 0, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 relative"
            >
              <Image
                src={enemyPlantmon.image}
                alt={enemyPlantmon.name}
                fill
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
            
            {/* 敌人信息 */}
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 text-white">
              <h3 className="font-bold text-lg mb-2">{enemyPlantmon.name}</h3>
              
              {/* 敌人HP条 */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <motion.div
                  animate={{ width: `${(enemyPlantmon.hp / enemyPlantmon.maxHp) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full"
                />
              </div>
              
              <p className="text-sm">
                HP: {enemyPlantmon.hp}/{enemyPlantmon.maxHp}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 战斗日志区域 */}
        <div className="bg-black/70 backdrop-blur-sm mx-4 rounded-2xl p-4 max-h-32 overflow-y-auto">
          <div className="space-y-1">
            {battleLog.slice(-4).map((log, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-white text-sm"
              >
                {log}
              </motion.p>
            ))}
          </div>
        </div>

        {/* 玩家区域 */}
        <div className="flex-1 flex items-start justify-center p-4">
          <motion.div
            animate={isAnimating && currentTurn === 'enemy' ? { x: [-10, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* 玩家植宠 */}
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 relative"
            >
              <Image
                src={playerPlantmon.image}
                alt={playerPlantmon.name}
                fill
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
            
            {/* 玩家信息 */}
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 text-white">
              <h3 className="font-bold text-lg mb-2">{playerPlantmon.name}</h3>
              
              {/* 玩家HP条 */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <motion.div
                  animate={{ width: `${(playerPlantmon.hp / playerPlantmon.maxHp) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                />
              </div>
              
              <p className="text-sm">
                HP: {playerPlantmon.hp}/{playerPlantmon.maxHp}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 操作区域 */}
        <div className="bg-black/70 backdrop-blur-sm m-4 rounded-2xl p-4">
          {battleResult === 'ongoing' ? (
            // 战斗中的操作
            <div>
              <div className="text-center mb-4">
                <p className="text-white text-lg font-semibold">
                  {currentTurn === 'player' ? '选择你的技能' : '敌人回合'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {playerPlantmon.skills.map((skill, index) => (
                  <motion.button
                    key={skill.id}
                    whileHover={{ scale: currentTurn === 'player' ? 1.05 : 1 }}
                    whileTap={{ scale: currentTurn === 'player' ? 0.95 : 1 }}
                    onClick={() => handlePlayerAttack(index)}
                    disabled={currentTurn !== 'player' || isAnimating}
                    className={`p-4 rounded-xl font-semibold transition-all ${
                      currentTurn === 'player' && !isAnimating
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-bold">{skill.name}</p>
                      <p className="text-sm opacity-80">伤害: {skill.damage}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            // 战斗结束的操作
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className={`text-6xl mb-4 ${battleResult === 'win' ? '🎉' : '😞'}`}>
                  {battleResult === 'win' ? '🎉' : '😞'}
                </div>
                
                <h2 className={`text-3xl font-bold mb-2 ${
                  battleResult === 'win' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {battleResult === 'win' ? '胜利！' : '失败！'}
                </h2>
                
                <p className="text-white text-lg">
                  {battleResult === 'win' 
                    ? `${playerPlantmon.name}表现出色！` 
                    : `${playerPlantmon.name}需要更多训练...`
                  }
                </p>
              </motion.div>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBattleAgain}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 
                             text-white font-bold py-4 px-6 rounded-xl
                             hover:from-green-600 hover:to-emerald-700 transition-all"
                >
                  再战一场
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoHome}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 
                             text-white font-bold py-4 px-6 rounded-xl
                             hover:from-gray-600 hover:to-gray-700 transition-all"
                >
                  返回首页
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 