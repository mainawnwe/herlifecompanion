import type { Mood } from '@/types';

// ============================================================
// LocalStorage Keys
// ============================================================
export const LS_KEYS = {
  profile: 'hlc_profile',
  journal: 'hlc_journal',
  periods: 'hlc_periods',
  todos: 'hlc_todos',
  dates: 'hlc_dates',
  bucket: 'hlc_bucket',
  water: 'hlc_water',
} as const;

// ============================================================
// Moods
// ============================================================
export const MOODS: Mood[] = [
  { emo: '😄', label: 'အရမ်းပျော်', val: 5, color: '#10B981' },
  { emo: '🙂', label: 'ပျော်', val: 4, color: '#34D399' },
  { emo: '😐', label: 'ပျော့', val: 3, color: '#FBBF24' },
  { emo: '😔', label: 'ဝမ်း', val: 2, color: '#F97316' },
  { emo: '😢', label: 'ငို', val: 1, color: '#EF4444' },
];

export const DEFAULT_MOOD: Mood = MOODS[2]; // 😐

// ============================================================
// WMO Weather Codes → Emoji + Burmese Description
// ============================================================
export const WMO_CODES: Record<number, { emoji: string; desc: string }> = {
  0: { emoji: '☀️', desc: 'သာယာ' },
  1: { emoji: '🌤️', desc: 'အနည်းငယ်တိမ်' },
  2: { emoji: '⛅', desc: 'တိမ်အသင့်' },
  3: { emoji: '☁️', desc: 'တိမ်ထူ' },
  45: { emoji: '🌫️', desc: 'မြူဆိုင်း' },
  48: { emoji: '🌫️', desc: 'မြူထူ' },
  51: { emoji: '🌦️', desc: 'မိုးဖွဲ' },
  53: { emoji: '🌦️', desc: 'မိုးဖွဲ' },
  55: { emoji: '🌦️', desc: 'မိုးဖွဲထူ' },
  61: { emoji: '🌧️', desc: 'မိုးအနည်းငယ်' },
  63: { emoji: '🌧️', desc: 'မိုး' },
  65: { emoji: '🌧️', desc: 'မိုးကြီး' },
  71: { emoji: '❄️', desc: 'ဆီးနှင်း' },
  73: { emoji: '❄️', desc: 'ဆီးနှင်း' },
  75: { emoji: '❄️', desc: 'ဆီးနှင်းကြီး' },
  80: { emoji: '🌦️', desc: 'မိုးရွာ' },
  81: { emoji: '🌧️', desc: 'မိုး' },
  82: { emoji: '⛈️', desc: 'မိုးကြီး' },
  95: { emoji: '⛈️', desc: 'မိုးကြိုး' },
  96: { emoji: '⛈️', desc: 'မိုးကြိုးမိုး' },
  99: { emoji: '⛈️', desc: 'မိုးကြိုးကြီး' },
};

// ============================================================
// App Config
// ============================================================
export const WATER_GOAL = 8;
export const PERIOD_CYCLE_DAYS = 28;
export const PERIOD_LENGTH_DAYS = 5;

// ============================================================
// Myanmar Months (for display)
// ============================================================
export const MM_MONTHS = [
  'ဇန်နဝါရီ',
  'ဖေဖော်ဝါရီ',
  'မတ်',
  'ဧပြီ',
  'မေ',
  'ဇွန်',
  'ဇူလိုင်',
  'ဩဂုတ်',
  'စက်တင်ဘာ',
  'အောက်တိုဘာ',
  'နိုဝင်ဘာ',
  'ဒီဇင်ဘာ',
];

export const MM_WEEKDAYS = [
  'တနင်္ဂနွေ',
  'တနင်္လာ',
  'အင်္ဂါ',
  'ဗုဒ္ဓဟူး',
  'ကြာသပတေး',
  'သောကြာ',
  'စနေ',
];
