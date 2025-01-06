import AsyncStorage from '@react-native-async-storage/async-storage';

export default class WaterDatabase {
  async init(): Promise<void> {
    console.log('Using AsyncStorage: No explicit init required');
  }

  async addRecord(date: string, consumed: number, goal: number): Promise<void> {
    try {
      const existingRecord = await this.getRecord(date);
      const updatedRecord = {
        consumed: (existingRecord?.consumed || 0) + consumed,
        goal: existingRecord?.goal || goal,
      };
      await this.saveRecord(date, updatedRecord);
    } catch (error) {
      console.error('Error adding record:', error);
    }
  }

  async updateRecord(date: string, consumed: number, goal: number): Promise<void> {
    try {
      const updatedRecord = { consumed, goal };
      await this.saveRecord(date, updatedRecord);
    } catch (error) {
      console.error('Error updating record:', error);
    }
  }

  async getRecord(date: string): Promise<{ consumed: number; goal: number } | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(date);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      } else {
        console.error(`Record for ${date} not found`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving record:', error);
      return null;
    }
  }

  async deleteRecord(date: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(date);
      console.log(`Record for ${date} deleted successfully`);
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  }

  async saveRecord(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`Record saved: ${key} = ${jsonValue}`);
    } catch (error) {
      console.error('Error saving record:', error);
    }
  }
}