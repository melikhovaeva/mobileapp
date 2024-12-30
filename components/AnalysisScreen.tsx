import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useWaterContext } from '@/context/WaterContext';

const screenWidth = Dimensions.get('window').width;

const AnalysisScreen = () => {
  const { dailyRecords } = useWaterContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  const getDataForPeriod = () => {
    const labels: string[] = [];
    const data: number[] = [];

    const today = new Date();
    if (selectedPeriod === 'day') {
      labels.push(today.getDate().toString());
      data.push(dailyRecords[today.toISOString().split('T')[0]]?.consumed || 0);
    } else if (selectedPeriod === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        labels.push(date.getDate().toString());
        data.push(dailyRecords[dateString]?.consumed || 0);
      }
    } else if (selectedPeriod === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        labels.push(date.getDate().toString());
        data.push(dailyRecords[dateString]?.consumed || 0);
      }
    }

    return { labels, data };
  };

  const { labels, data } = getDataForPeriod();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Анализ потребления воды</Text>
      <View style={styles.buttonsRow}>
      <Button
          title="День"
          onPress={() => setSelectedPeriod('day')}
          color={selectedPeriod === 'day' ? '#1E90FF' : '#000'}
        />
        <Button
          title="Неделя"
          onPress={() => setSelectedPeriod('week')}
          color={selectedPeriod === 'week' ? '#1E90FF' : '#000'}
        />
        <Button
          title="Месяц"
          onPress={() => setSelectedPeriod('month')}
          color={selectedPeriod === 'month' ? '#1E90FF' : '#000'}
        />
      </View>
      <View style={styles.chartBackground}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartScrollContainer}
      >
        <LineChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={Math.max(screenWidth, labels.length * 50)}
          height={300}
          yAxisSuffix=" мл"
          chartConfig={{
            backgroundColor: '#1E90FF',
            backgroundGradientFrom: '#1E90FF',
            backgroundGradientTo: '#1E90FF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForBackgroundLines: {
              strokeWidth: 0.5,
              strokeDasharray: '',
              stroke: 'rgba(255, 255, 255, 0.2)',
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#87CEFA',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </ScrollView>
      </View>

      {/* История данных */}
      <View style={styles.history}>
        <Text style={styles.historyTitle}>История потребления</Text>
        <ScrollView style={styles.historyScroll}>
          {labels.map((label, index) => (
            <View key={index} style={styles.historyRow}>
              <Text style={styles.historyDate}>{label}:</Text>
              <Text style={styles.historyText}>{data[index]} мл</Text>
            </View>
          ))}
        </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
  },
  chartScrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  chartBackground: {
    backgroundColor: '#1E90FF',
    borderRadius: 16,          
    paddingVertical: 16,      
  },
  history: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyText: {
    fontSize: 16,
    color: '#1E90FF',
  },
  historyScroll: {
    maxHeight: 250,
  },
});

export default AnalysisScreen;