import React, { useState } from 'react';
import { FlatList, Alert, StyleSheet } from 'react-native';
import WeightInputForm from '@/components/WeightInputForm';
import WaterCalendar from '@/components/WaterCalendar';
import AddWaterButtons from '@/components/AddWaterButtons';
import LogItem from '@/components/LogItem';
import Progress from '@/components/Progress';

interface Day {
  dateString: string;
  day: number;
  month: number;
  year: number;
}

export default function WaterTracker() {
  const [weight, setWeight] = useState<string>(''); // Вес пользователя
  const [waterGoal, setWaterGoal] = useState<number | null>(null); // Целевая норма воды
  const [waterConsumed, setWaterConsumed] = useState<number>(0); // Выпитая вода
  const [log, setLog] = useState<number[]>([]); // История потребления воды
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Выбранная дата
  const [dailyRecords, setDailyRecords] = useState<Record<string, { consumed: number }>>({}); // Данные по дням

  const calculateWaterGoal = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Ошибка', 'Введите корректный вес!');
      return;
    }
  
    const goal = weightNum * 30; // Норма воды: 30 мл на кг веса
  
    // Сбрасываем прогресс для текущей даты
    const updatedDailyRecords = {
      ...dailyRecords,
      [selectedDate]: { consumed: 0 }, // Сбрасываем выпитую воду для выбранной даты
    };
  
    setWaterGoal(goal); // Обновляем дневную норму
    setDailyRecords(updatedDailyRecords); // Обновляем объект с данными
    setWaterConsumed(0); // Обнуляем прогресс для отображения
    setLog([]); // Сбрасываем локальную историю
  };

  const addWater = (amount: number) => {
    if (!waterGoal) {
      Alert.alert('Ошибка', 'Сначала рассчитайте норму воды!');
      return;
    }
  
    const newConsumed = (dailyRecords[selectedDate]?.consumed || 0) + amount;
  
    const updatedDailyRecords = {
      ...dailyRecords,
      [selectedDate]: { consumed: newConsumed },
    };
  
    setDailyRecords(updatedDailyRecords); // Обновляем объект данных
    setWaterConsumed(newConsumed); // Обновляем локальный прогресс
  
    // Проверка достижения цели
    if (newConsumed >= waterGoal) {
      Alert.alert('Поздравляем!', `Вы достигли своей цели на ${selectedDate}!`);
    }
  };

  const onDateChange = (day: Day) => {
    const selected = day.dateString;
    setSelectedDate(selected);
    setWaterConsumed(dailyRecords[selected]?.consumed || 0); 
    setLog([]); 
  };

  return (
    <FlatList
      data={log}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <>
          <WeightInputForm
            weight={weight}
            setWeight={setWeight}
            calculateWaterGoal={calculateWaterGoal}
          />
          <WaterCalendar
            dailyRecords={dailyRecords}
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            waterGoal={waterGoal}
          />
          {waterGoal && (
            <Progress
              goal={waterGoal}
              consumed={waterConsumed}
              remaining={Math.max(waterGoal - waterConsumed, 0)}
            />
          )}
          {waterGoal && <AddWaterButtons addWater={addWater} />}
        </>
      }
      renderItem={({ item, index }) => <LogItem index={index} amount={item} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
});