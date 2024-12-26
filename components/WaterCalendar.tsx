import React from 'react';
import { Calendar } from 'react-native-calendars';

interface WaterCalendarProps {
  dailyRecords: Record<string, { consumed: number }>;
  selectedDate: string;
  onDateChange: (day: { dateString: string }) => void;
  waterGoal: number | null;
}

const WaterCalendar: React.FC<WaterCalendarProps> = ({
  dailyRecords,
  selectedDate,
  onDateChange,
  waterGoal,
}) => {
  return (
    <Calendar
      onDayPress={onDateChange}
      markedDates={{
        ...Object.keys(dailyRecords).reduce<Record<
          string,
          { selected?: boolean; marked?: boolean; selectedColor?: string; dotColor?: string }
        >>((acc, date) => {
          acc[date] = {
            selected: date === selectedDate,
            marked: dailyRecords[date]?.consumed >= (waterGoal || 0),
            selectedColor: '#1E3A8A',
            dotColor: dailyRecords[date]?.consumed >= (waterGoal || 0) ? 'green' : 'red',
          };
          return acc;
        }, {}),
      }}
    />
  );
};

export default WaterCalendar;