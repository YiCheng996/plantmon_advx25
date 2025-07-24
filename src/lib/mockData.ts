import { Plantmon, PlantmonSkill } from '@/types/plantmon';

// 模拟技能数据
const mockSkills: PlantmonSkill[] = [
  {
    id: 'skill1',
    name: '火焰喷射',
    description: '喷射出炽热的火焰攻击敌人',
    damage: 25,
    attribute: 'fire',
  },
  {
    id: 'skill2',
    name: '水枪攻击',
    description: '发射高压水流进行攻击',
    damage: 20,
    attribute: 'water',
  },
  {
    id: 'skill3',
    name: '藤蔓鞭打',
    description: '使用坚韧的藤蔓攻击敌人',
    damage: 22,
    attribute: 'grass',
  },
  {
    id: 'skill4',
    name: '电击',
    description: '释放强烈的电流攻击',
    damage: 28,
    attribute: 'electric',
  },
];

// 模拟植宠数据
export const mockPlantmons: Plantmon[] = [
  {
    id: 'plantmon1',
    name: '火焰花',
    image: '/assets/roles/20250724-183408.png',
    attributes: ['fire', 'grass'],
    skills: [mockSkills[0], mockSkills[2]],
    description: '一种生长在火山口附近的神奇植物，能够喷射出炽热的火焰。',
    hp: 100,
    maxHp: 100,
    isActive: false,
    capturedAt: new Date(),
  },
  {
    id: 'plantmon2',
    name: '水晶草',
    image: '/assets/roles/20250724-183436.png',
    attributes: ['water', 'grass'],
    skills: [mockSkills[1], mockSkills[2]],
    description: '晶莹剔透的水系植物，能够控制水流进行攻击。',
    hp: 95,
    maxHp: 95,
    isActive: false,
    capturedAt: new Date(),
  },
  {
    id: 'plantmon3',
    name: '雷电蕨',
    image: '/assets/roles/20250724-183440.png',
    attributes: ['electric', 'grass'],
    skills: [mockSkills[3], mockSkills[2]],
    description: '带有电流的神秘蕨类植物，能够释放强烈的电击。',
    hp: 90,
    maxHp: 90,
    isActive: false,
    capturedAt: new Date(),
  },
];

// 生成随机敌人植宠
export function generateRandomEnemy(): Plantmon {
  const enemies = [
    {
      id: 'enemy1',
      name: '野生火蜥',
      image: '/assets/roles/20250724-183451.png',
      attributes: ['fire' as const],
      skills: [mockSkills[0]],
      description: '野生的火系植宠，攻击力强但防御较弱。',
      hp: 80,
      maxHp: 80,
      isActive: true,
      capturedAt: new Date(),
    },
    {
      id: 'enemy2',
      name: '冰霜花',
      image: '/assets/roles/20250724-183509.png',
      attributes: ['water' as const],
      skills: [mockSkills[1]],
      description: '冰冷的水系植宠，能够冻结敌人。',
      hp: 85,
      maxHp: 85,
      isActive: true,
      capturedAt: new Date(),
    },
  ];
  
  return enemies[Math.floor(Math.random() * enemies.length)];
} 