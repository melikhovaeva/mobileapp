import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import AddWaterButtons from '@/components/AddWaterButtons';
import WaterCalendar from '@/components/WaterCalendar';
import { useWaterContext } from '@/context/WaterContext';
import WaterDatabase from '@/backend/WaterDatabase';

const ExploreScreen = () => {
  const { dailyRecords, setDailyRecords, waterGoal, weight } = useWaterContext();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Лог для отладки
  console.log('Current Water Goal:', waterGoal);
  console.log('Current Weight:', weight);

  useEffect(() => {
    const fetchRecords = async () => {
      const db = new WaterDatabase();
      await db.init();
      const allRecords = await db.getAllRecords();

      console.log('Fetched Records:', allRecords);

      const recordsObject: Record<string, { consumed: number; goal: number }> = {};
      allRecords.forEach((record) => {
        recordsObject[record.date] = {
          consumed: record.consumed,
          goal: record.goal,
        };
      });

      setDailyRecords(recordsObject);
    };

    fetchRecords();
  }, []);

  const addWater = async (amount: number) => {
    const db = new WaterDatabase();
    const today = selectedDate;
    const record = dailyRecords[today] || { consumed: 0, goal: waterGoal || 2000 };

    console.log(`Adding Water: ${amount} ml on ${today}`);
    console.log('Before Update:', dailyRecords[today]);

    const updatedConsumed = record.consumed + amount;
    const updatedRecords = {
      ...dailyRecords,
      [today]: { consumed: updatedConsumed, goal: record.goal },
    };

    setDailyRecords(updatedRecords);
    console.log('After Update:', updatedRecords);

    await db.updateRecord(today, updatedConsumed, record.goal);
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
            При весе: {weight} кг
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