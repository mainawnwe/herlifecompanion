// ============================================================
// Her Life Companion — Global Type Definitions
// ============================================================

/** အသုံးပြုသူ Profile */
export interface Profile {
  name: string;
  birthday: string; // ISO date: YYYY-MM-DD
  partner: string;
  createdAt: string;
}

/** စိတ်ခံစားချက် အမျိုးအစား */
export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface Mood {
  emo: string;
  label: string;
  val: MoodValue;
  color: string;
}

/** ဒိုင်ယာရီ မှတ်တမ်း */
export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodValue;
  moodEmo: string;
  moodLabel: string;
  text: string;
  createdAt: number;
}

/** ရာသီစက်ဝန်း မှတ်တမ်း */
export interface PeriodRecord {
  id: string;
  startDate: string; // YYYY-MM-DD
  note?: string;
  createdAt: number;
}

/** လုပ်စရာစာရင်း */
export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

/** အရေးကြီးရက် */
export interface ImportantDate {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD (recurring yearly)
  createdAt: number;
}

/** အတူလုပ်ချင်တာ */
export interface BucketItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

/** ရေသောက်မှု */
export interface WaterState {
  date: string; // YYYY-MM-DD (reset daily)
  count: number; // 0-8
}

/** Weather API response */
export interface WeatherData {
  temperature: number;
  humidity: number;
  code: number;
  description: string;
  emoji: string;
}
