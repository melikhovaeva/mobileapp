import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Button from '@/components/Button';
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
    setWaterGoal(goal);
    setWaterConsumed(0); // Обнуляем прогресс
    setLog([]); // Сбрасываем историю
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

    setDailyRecords(updatedDailyRecords); // Обновляем общий объект данных
    setWaterConsumed(newConsumed); // Обновляем локальный прогресс для отображения
    setLog([...log, amount]); // Добавляем в локальную историю

    if (newConsumed >= waterGoal) {
      Alert.alert('Поздравляем!', `Вы достигли своей цели на ${selectedDate}!`);
    }
  };

  const onDateChange = (day: Day) => {
    const selected = day.dateString;
    setSelectedDate(selected);
    setWaterConsumed(dailyRecords[selected]?.consumed || 0); // Загружаем прогресс для выбранной даты
    setLog([]); // Очищаем локальную историю для новой даты
  };

  return (
    <FlatList
      data={log}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.title}>Water Tracker</Text>

          {/* Форма ввода веса */}
          <View style={styles.form}>
            <Text style={styles.label}>Введите ваш вес (в кг):</Text>
            <TextInput
              style={styles.input}
              placeholder="Например, 70"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <Button text="Рассчитать норму воды" onPress={calculateWaterGoal} />
          </View>

          {/* Календарь */}
          <Calendar
            onDayPress={onDateChange}
            markedDates={{
              ...Object.keys(dailyRecords).reduce<Record<string, { selected?: boolean; marked?: boolean; selectedColor?: string; dotColor?: string }>>((acc, date) => {
                acc[date] = {
                  selected: date === selectedDate,
                  marked: dailyRecords[date]?.consumed >= (waterGoal || 0),
                  selectedColor: '#1E3A8A',
                  dotColor: dailyRecords[date]?.consumed >= (waterGoal || 0) ? 'green' : 'red',
                };
                return acc;
              }, {}),
            }}
          />

          {/* Прогресс */}
          {waterGoal && (
            <Progress
              goal={waterGoal}
              consumed={waterConsumed}
              remaining={Math.max(waterGoal - waterConsumed, 0)}
            />
          )}

          {/* Кнопки добавления воды */}
          {waterGoal && (
            <View style={styles.addWaterContainer}>
              <Button text="+100 мл" onPress={() => addWater(100)} />
              <Button text="+200 мл" onPress={() => addWater(200)} />
              <Button text="+300 мл" onPress={() => addWater(300)} />
            </View>
          )}
        </View>
      }
      renderItem={({ item, index }) => <LogItem index={index} amount={item} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  addWaterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
});