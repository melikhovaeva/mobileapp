import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import AddWaterButtons from '@/components/AddWaterButtons';
import WaterCalendar from '@/components/WaterCalendar';
import { useWaterContext, DailyRecord } from '@/context/WaterContext';
import WaterDatabase from '@/backend/WaterDatabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExploreScreen = () => {
  const { dailyRecords, setDailyRecords, waterGoal, weight } = useWaterContext();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const fetchRecords = async () => {
      const db = new WaterDatabase();
      await db.init();

      try {
        const keys = await AsyncStorage.getAllKeys();
        const stores = await AsyncStorage.multiGet(keys);

        const recordsObject: Record<string, DailyRecord> = {};
        stores.forEach(([key, value]) => {
          if (value) {
            const parsedRecord = JSON.parse(value);

            
            recordsObject[key] = {
              consumed: parsedRecord.consumed || 0,
              goal: parsedRecord.goal || (weight ? parseFloat(weight) * 30 : 2000), 
              weight: parsedRecord.weight || parseFloat(weight) || 70, // Задаем вес по умолчанию, если его нет
            };
          }
        });

        console.log('Fetched Records:', recordsObject);
        setDailyRecords(recordsObject);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, [weight]);

  const addWater = async (amount: number) => {
    const db = new WaterDatabase();
    const today = selectedDate;
    const record = dailyRecords[today] || { consumed: 0, goal: waterGoal || 2000, weight: parseFloat(weight) || 70 };

    console.log(`Adding Water: ${amount} ml on ${today}`);
    console.log('Before Update:', dailyRecords[today]);

    const updatedConsumed = record.consumed + amount;
    const updatedRecords = {
      ...dailyRecords,
      [today]: { consumed: updatedConsumed, goal: record.goal, weight: record.weight },
    };

    setDailyRecords(updatedRecords);
    console.log('After Update:', updatedRecords);

    await db.updateRecord(today, updatedConsumed, record.goal, record.weight);
  };

  return (
    <ScrollView style={styles.container}>
      <WaterCalendar
        dailyRecords={dailyRecords}
        selectedDate={selectedDate}
        onDateChange={(day) => setSelectedDate(day.dateString)}
        waterGoal={waterGoal || 2000}
      />
      <AddWaterButtons addWater={addWater} />
      <View style={styles.status}>
        <Text style={styles.text}>
          Выпито: {dailyRecords[selectedDate]?.consumed || 0} мл
        </Text>
        <Text style={styles.text}>
          Цель: {dailyRecords[selectedDate]?.goal || 0} мл
        </Text>
        {weight && (
          <Text style={styles.text}>
            При весе: {dailyRecords[selectedDate]?.weight || weight} кг
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  status: {
    marginTop: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#1E90FF',
    marginVertical: 4,
  },
});

export default ExploreScreen;