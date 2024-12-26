import React from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useWaterContext } from '@/context/WaterContext';

const screenWidth = Dimensions.get('window').width;

export default function AnalysisScreen() {
  const { dailyRecords } = useWaterContext();

  // Преобразуем dailyRecords в массив для графика
  const monthlyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(i + 1);
    const dateString = date.toISOString().split('T')[0];
    return dailyRecords[dateString]?.consumed || 0;
  });

  const labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Анализ потребления воды за месяц</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: monthlyData,
              },
            ],
          }}
          width={screenWidth + labels.length * 10} // Увеличиваем ширину графика
          height={220}
          yAxisSuffix="мл"
          chartConfig={{
            backgroundColor: '#1E90FF',
            backgroundGradientFrom: '#1E90FF',
            backgroundGradientTo: '#87CEFA',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={styles.chart}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});