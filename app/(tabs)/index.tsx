import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import WeightInputForm from '@/components/WeightInputForm';
import { useWaterContext } from '@/context/WaterContext';

export default function HomeScreen() {
  const { weight, setWeight, waterGoal, setWaterGoal } = useWaterContext();

  const calculateWaterGoal = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Ошибка', 'Введите корректный вес!');
      return;
    }

    const goal = weightNum * 30; // Норма воды: 30 мл на кг
    setWaterGoal(goal);
    Alert.alert('Норма воды', `Ваша дневная норма воды: ${goal} мл.`);
  };

  return (
    <View style={styles.container}>
      <WeightInputForm
        weight={weight}
        setWeight={setWeight}
        calculateWaterGoal={calculateWaterGoal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
});