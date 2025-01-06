import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import WeightInputForm from '@/components/WeightInputForm';
import { useWaterContext } from '@/context/WaterContext';

const HomeScreen = () => {
  const { weight, setWeight, calculateWaterGoal, waterGoal } = useWaterContext();
  const [message, setMessage] = useState<string>(''); 
  const [previousWeight, setPreviousWeight] = useState<string>('');

  const handleCalculateGoal = async () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Введите корректный вес!');
      return;
    }

    setPreviousWeight(weight);

    await calculateWaterGoal();

    setMessage(`Текущая дневная норма воды: ${weightNum * 30} мл`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Рассчитайте вашу норму воды</Text>
      <WeightInputForm
        weight={weight}
        setWeight={setWeight}
        calculateWaterGoal={handleCalculateGoal}
      />
      {message && (
        <Text style={styles.result}>
          {message}{"\n"}
          {previousWeight && `Последний расчет был при весе: ${previousWeight} кг`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1E3A8A',
  },
  result: {
    fontSize: 18,
    color: '#10B981',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default HomeScreen;