import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressProps {
  goal: number;
  consumed: number;
  remaining: number;
}

const Progress: React.FC<ProgressProps> = ({ goal, consumed, remaining }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Ваша дневная норма: <Text style={styles.highlight}>{goal} мл</Text>
      </Text>
      <Text style={styles.text}>
        Выпито: <Text style={styles.highlight}>{consumed} мл</Text>
      </Text>
      <Text style={styles.text}>
        Осталось: <Text style={styles.highlight}>{remaining} мл</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginTop: 24,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
});

export default Progress;