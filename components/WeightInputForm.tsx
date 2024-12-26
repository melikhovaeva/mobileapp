import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from './Button';

interface WeightInputFormProps {
  weight: string;
  setWeight: (value: string) => void;
  calculateWaterGoal: () => void;
}

const WeightInputForm: React.FC<WeightInputFormProps> = ({
  weight,
  setWeight,
  calculateWaterGoal,
}) => {
  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    marginHorizontal: 20,
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
});

export default WeightInputForm;