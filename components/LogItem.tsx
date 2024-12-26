import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface LogItemProps {
  index: number;
  amount: number;
}

const LogItem: React.FC<LogItemProps> = ({ index, amount }) => {
  return (
    <Text style={styles.logItem}>
      {index + 1}. Добавлено: {amount} мл
    </Text>
  );
};

const styles = StyleSheet.create({
  logItem: {
    fontSize: 14,
    color: '#4B5563',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});

export default LogItem;