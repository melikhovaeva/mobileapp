import React, { createContext, useState, ReactNode, useContext } from 'react';
import WaterDatabase from '@/backend/WaterDatabase';

interface DailyRecord {
  consumed: number;
  goal: number;
}

interface WaterContextProps {
  weight: string;
  setWeight: (value: string) => Promise<void>;
  waterGoal: number | null;
  setWaterGoal: (value: number | null) => void; // Добавлено setWaterGoal
  dailyRecords: Record<string, DailyRecord>;
  setDailyRecords: (records: Record<string, DailyRecord>) => void;
  calculateWaterGoal: (currentWeight?: string) => Promise<void>;
}

const WaterContext = createContext<WaterContextProps | undefined>(undefined);

export const WaterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weight, setWeightState] = useState<string>(''); // Вес пользователя
  const [waterGoal, setWaterGoal] = useState<number | null>(null); // Норма воды
  const [dailyRecords, setDailyRecords] = useState<Record<string, DailyRecord>>({}); // История потребления воды

  const db = new WaterDatabase();

  const setWeight = async (value: string) => {
    setWeightState(value);
    await calculateWaterGoal(value); // Пересчитываем норму воды при изменении веса
  };

  const calculateWaterGoal = async (currentWeight = weight) => {
    const weightNum = parseFloat(currentWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      console.error('Введите корректный вес для расчета нормы воды.');
      return;
    }

    const goal = weightNum * 30; // Расчет нормы воды: 30 мл на 1 кг веса
    setWaterGoal(goal);

    const today = new Date().toISOString().split('T')[0];

    // Обновляем или создаем запись в базе данных
    await db.init();
    await db.updateRecord(today, dailyRecords[today]?.consumed || 0, goal);

    // Обновляем локальные данные
    const updatedRecords = {
      ...dailyRecords,
      [today]: { consumed: dailyRecords[today]?.consumed || 0, goal },
    };
    setDailyRecords(updatedRecords);
  };

  return (
    <WaterContext.Provider
      value={{
        weight,
        setWeight,
        waterGoal,
        setWaterGoal, // Передаем setWaterGoal в контекст
        dailyRecords,
        setDailyRecords,
        calculateWaterGoal,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
};

export const useWaterContext = (): WaterContextProps => {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWaterContext must be used within a WaterProvider');
  }
  return context;
};