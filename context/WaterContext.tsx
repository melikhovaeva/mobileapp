import React, { createContext, useState, ReactNode, useContext } from 'react';

interface WaterContextProps {
  weight: string;
  setWeight: (value: string) => void;
  waterGoal: number | null;
  setWaterGoal: (value: number | null) => void;
  dailyRecords: Record<string, { consumed: number }>;
  setDailyRecords: (records: Record<string, { consumed: number }>) => void;
}

const WaterContext = createContext<WaterContextProps | undefined>(undefined);

export const WaterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weight, setWeight] = useState<string>(''); // Вес пользователя
  const [waterGoal, setWaterGoal] = useState<number | null>(null); // Норма воды
  const [dailyRecords, setDailyRecords] = useState<Record<string, { consumed: number }>>({}); // История потребления воды

  return (
    <WaterContext.Provider
      value={{ weight, setWeight, waterGoal, setWaterGoal, dailyRecords, setDailyRecords }}
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