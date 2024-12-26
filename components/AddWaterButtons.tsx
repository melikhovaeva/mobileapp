import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './Button';

interface AddWaterButtonsProps {
  addWater: (amount: number) => void;
}

const AddWaterButtons: React.FC<AddWaterButtonsProps> = ({ addWater }) => {
  return (
    <View style={styles.container}>
      <Button text="+100 мл" onPress={() => addWater(100)} />
      <Button text="+200 мл" onPress={() => addWater(200)} />
      <Button text="+300 мл" onPress={() => addWater(300)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    alignContent: 'space-around',
  },
});

export default AddWaterButtons;