import React from 'react';
import { CalendarList } from 'react-native-calendars';
import { StyleSheet } from 'react-native';

interface MiniCalendarProps {
  selectedDate: string;
  onDateChange: (day: { dateString: string }) => void;
  markedDates: Record<string, any>; // Для отображения меток (например, прогресса воды)
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onDateChange, markedDates }) => {
  return (
    <CalendarList
      current={selectedDate}
      pastScrollRange={0} // Не показывать прошлые недели
      futureScrollRange={1} // Показывать только следующую неделю
      horizontal
      pagingEnabled
      onDayPress={onDateChange}
      markingType={'dot'}
      markedDates={markedDates}
      theme={{
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#2d4150',
        selectedDayBackgroundColor: '#1E90FF',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#FF6347',
        dayTextColor: '#2d4150',
        textDisabledColor: '#d9e1e8',
        dotColor: '#1E90FF',
        selectedDotColor: '#ffffff',
        arrowColor: '#1E90FF',
        monthTextColor: '#1E90FF',
        textDayFontSize: 12,
        textMonthFontSize: 14,
        textDayHeaderFontSize: 12,
      }}
      style={styles.calendarList}
    />
  );
};

const styles = StyleSheet.create({
  calendarList: {
    height: 100, // Устанавливаем минимальную высоту для компактного вида
  },
});

export default MiniCalendar;