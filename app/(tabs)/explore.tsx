import React, { useState } from 'react';
import { FlatList, StyleSheet, Alert } from 'react-native';
import WaterCalendar from '@/components/WaterCalendar';
import AddWaterButtons from '@/components/AddWaterButtons';
import LogItem from '@/components/LogItem';
import Progress from '@/components/Progress';
import { useWaterContext } from '@/context/WaterContext';

export default function ExploreScreen() {
  const { waterGoal, dailyRecords, setDailyRecords } = useWaterContext();
  const [waterConsumed, setWaterConsumed] = useState<number>(0);
  const [log, setLog] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const addWater = (amount: number) => {
    const newConsumed = (dailyRecords[selectedDate]?.consumed || 0) + amount;
    const updatedDailyRecords = {
      ...dailyRecords,
      [selectedDate]: { consumed: newConsumed },
    };

    setDailyRecords(updatedDailyRecords);
    setWaterConsumed(newConsumed);
    setLog([...log, amount]);

    if (waterGoal && newConsumed >= waterGoal) {
      Alert.alert('Поздравляем!', `Вы достигли своей цели на ${selectedDate}!`);
    }
  };

  const onDateChange = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setWaterConsumed(dailyRecords[day.dateString]?.consumed || 0);
    setLog([]);
  };

  return (
    <FlatList
      data={log}
      keyExtractor={(item, index) => `${selectedDate}-${index}`}
      ListHeaderComponent={
        <>
          <WaterCalendar
            dailyRecords={dailyRecords}
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            waterGoal={waterGoal}
          />
          <Progress
            goal={waterGoal || 0}
            consumed={waterConsumed}
            remaining={Math.max((waterGoal || 0) - waterConsumed, 0)}
          />
          <AddWaterButtons addWater={addWater} />
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