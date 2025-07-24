// 植宠属性类型
export type PlantmonAttribute = 'fire' | 'water' | 'grass' | 'electric' | 'flying' | 'ground';

// 植宠技能接口
export interface PlantmonSkill {
  id: string;
  name: string;
  description: string;
  damage: number;
  attribute: PlantmonAttribute;
}

// 植宠接口
export interface Plantmon {
  id: string;
  name: string;
  image: string;
  attributes: PlantmonAttribute[];
  skills: PlantmonSkill[];
  description: string;
  hp: number;
  maxHp: number;
  isActive: boolean; // 是否为出战状态
  capturedAt: Date;
}

// 战斗状态接口
export interface BattleState {
  playerPlantmon: Plantmon | null;
  enemyPlantmon: Plantmon | null;
  currentTurn: 'player' | 'enemy';
  battleResult: 'win' | 'lose' | 'ongoing' | null;
}

// 游戏状态接口
export interface GameState {
  plantmons: Plantmon[];
  activePlantmon: Plantmon | null;
  isFirstTime: boolean;
} 