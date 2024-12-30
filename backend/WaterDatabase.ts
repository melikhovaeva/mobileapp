import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

export default class WaterDatabase {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    if (!this.db) {
      this.db = await SQLite.openDatabase({
        name: 'WaterTracker.db',
        location: 'default',
      });
    }

    // Создаём таблицу, если её нет
    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT UNIQUE NOT NULL,
        consumed INTEGER NOT NULL DEFAULT 0,
        goal INTEGER NOT NULL DEFAULT 0
      );`
    );
  }

  async getRecordByDate(date: string): Promise<{ consumed: number; goal: number } | null> {
    const results = await this.db?.executeSql(`SELECT * FROM records WHERE date = ?`, [date]);
    if (results && results.length > 0) {
      const result = results[0];
      if (result.rows.length > 0) {
        return result.rows.item(0); 
      }
    }
    return null;
  }

  async updateRecord(date: string, consumed: number, goal: number): Promise<void> {
    await this.db?.executeSql(
      `INSERT OR REPLACE INTO records (date, consumed, goal) VALUES (?, ?, ?)`,
      [date, consumed, goal]
    );
  }

  async getAllRecords(): Promise<{ date: string; consumed: number; goal: number }[]> {
    const results = await this.db?.executeSql(`SELECT * FROM records`);
    if (results && results.length > 0) {
      const result = results[0];
      const records: { date: string; consumed: number; goal: number }[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        records.push(result.rows.item(i));
      }
      return records;
    }
    return [];
  }
}