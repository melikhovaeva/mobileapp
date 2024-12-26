import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface AddWaterButtonsProps {
  addWater: (amount: number) => void;
}

const AddWaterButtons: React.FC<AddWaterButtonsProps> = ({ addWater }) => {
  const [customAmount, setCustomAmount] = useState<string>(''); // Поле для ввода

  const handleAddCustomAmount = () => {
    const amount = parseInt(customAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      alert('Введите корректное количество воды.');
      return;
    }
    addWater(amount);
    setCustomAmount(''); // Сбрасываем поле ввода
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        {[100, 200, 300].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={styles.templateButton}
            onPress={() => addWater(amount)}
          >
            <Text style={styles.templateButtonText}>+{amount} мл</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.manualInputRow}>
        <TextInput
          style={styles.input}
          value={customAmount}
          onChangeText={setCustomAmount}
          keyboardType="numeric"
          placeholder="Введите мл"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCustomAmount}>
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  templateButton: {
    borderColor: '#1E90FF',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  templateButtonText: {
    color: '#1E90FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  manualInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
    fontSize: 16,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddWaterButtons;