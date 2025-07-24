'use client';

import { useGame } from '@/contexts/GameContext';
import { mockPlantmons } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const { state, addPlantmon, setActivePlantmon } = useGame();
  const router = useRouter();

  const handleAddMockData = () => {
    mockPlantmons.forEach((plantmon) => {
      addPlantmon(plantmon);
    });
  };

  const handleSetActive = (id: string) => {
    setActivePlantmon(id);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">测试页面</h1>
        
        <div className="space-y-6">
          {/* 控制按钮 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">控制面板</h2>
            <div className="space-x-4">
              <button
                onClick={handleAddMockData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                添加模拟植宠数据
              </button>
              <button
                onClick={handleGoHome}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                返回首页
              </button>
            </div>
          </div>

          {/* 当前状态 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">当前状态</h2>
            <p>植宠总数: {state.plantmons.length}</p>
            <p>出战植宠: {state.activePlantmon?.name || '无'}</p>
            <p>首次进入: {state.isFirstTime ? '是' : '否'}</p>
          </div>

          {/* 植宠列表 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">植宠列表</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.plantmons.map((plantmon) => (
                <div
                  key={plantmon.id}
                  className={`p-4 border rounded-lg ${
                    plantmon.isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <h3 className="font-semibold">{plantmon.name}</h3>
                  <p className="text-sm text-gray-600">{plantmon.description}</p>
                  <p className="text-sm">属性: {plantmon.attributes.join(', ')}</p>
                  <p className="text-sm">HP: {plantmon.hp}/{plantmon.maxHp}</p>
                  <button
                    onClick={() => handleSetActive(plantmon.id)}
                    className={`mt-2 px-3 py-1 rounded text-sm ${
                      plantmon.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {plantmon.isActive ? '当前出战' : '设为出战'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 