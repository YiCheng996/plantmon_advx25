'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Plantmon } from '@/types/plantmon';

// 动作类型
type GameAction =
  | { type: 'ADD_PLANTMON'; payload: Plantmon }
  | { type: 'SET_ACTIVE_PLANTMON'; payload: string }
  | { type: 'REMOVE_ACTIVE_PLANTMON' }
  | { type: 'LOAD_GAME_STATE'; payload: GameState };

// 初始状态
const initialState: GameState = {
  plantmons: [],
  activePlantmon: null,
  isFirstTime: true,
};

// Reducer函数
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLANTMON':
      return {
        ...state,
        plantmons: [...state.plantmons, action.payload],
        isFirstTime: false,
      };
    
    case 'SET_ACTIVE_PLANTMON':
      const updatedPlantmons = state.plantmons.map(p => ({
        ...p,
        isActive: p.id === action.payload,
      }));
      const activePlantmon = updatedPlantmons.find(p => p.id === action.payload) || null;
      
      return {
        ...state,
        plantmons: updatedPlantmons,
        activePlantmon,
      };
    
    case 'REMOVE_ACTIVE_PLANTMON':
      return {
        ...state,
        plantmons: state.plantmons.map(p => ({ ...p, isActive: false })),
        activePlantmon: null,
      };
    
    case 'LOAD_GAME_STATE':
      return action.payload;
    
    default:
      return state;
  }
}

// Context接口
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  addPlantmon: (plantmon: Plantmon) => void;
  setActivePlantmon: (id: string) => void;
  removeActivePlantmon: () => void;
}

// 创建Context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider组件
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const addPlantmon = (plantmon: Plantmon) => {
    dispatch({ type: 'ADD_PLANTMON', payload: plantmon });
  };

  const setActivePlantmon = (id: string) => {
    dispatch({ type: 'SET_ACTIVE_PLANTMON', payload: id });
  };

  const removeActivePlantmon = () => {
    dispatch({ type: 'REMOVE_ACTIVE_PLANTMON' });
  };

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      addPlantmon,
      setActivePlantmon,
      removeActivePlantmon,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook for using the context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 