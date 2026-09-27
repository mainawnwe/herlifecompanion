import { MM_MONTHS, MM_WEEKDAYS } from './constants';

// ============================================================
// Date Helpers
// ============================================================

/** ဒီနေ့ရဲ့ ISO date (YYYY-MM-DD) */
export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** ISO date → Myanmar display (ဥပမာ: စက်တင်ဘာ ၃၀) */
export function formatMM(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MM_MONTHS[m - 1]} ${d}`;
}

/** ISO date → Myanmar full date (ဥပမာ: စနေ၊ စက်တင်ဘာ ၃၀၊ ၂၀၂၆) */
export function formatMMFull(iso: string): string {
  const date = new Date(iso);
  const wd = MM_WEEKDAYS[date.getDay()];
  const y = date.getFullYear();
  return `${wd}၊ ${MM_MONTHS[date.getMonth()]} ${date.getDate()}၊ ${y}`;
}

/** ဒီနေ့ရဲ့ Myanmar full date */
export function todayMMFull(): string {
  const d = new Date();
  const wd = MM_WEEKDAYS[d.getDay()];
  const y = d.getFullYear();
  return `${wd}၊ ${MM_MONTHS[d.getMonth()]} ${d.getDate()}၊ ${y}`;
}

/** ရက်နှစ်ခုကြား ကွာဟမှု (days) */
export function daysBetween(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/** မွေးနေ့ နောက်တစ်ကြိမ် (recurring yearly) */
export function nextBirthday(birthdayISO: string): Date {
  const [y, m, d] = birthdayISO.split('-').map(Number);
  const now = new Date();
  let next = new Date(now.getFullYear(), m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (next < today) {
    next = new Date(now.getFullYear() + 1, m - 1, d);
  }
  return next;
}

/** Recurring yearly date (anniversary, etc.) */
export function nextOccurrence(dateISO: string): Date {
  return nextBirthday(dateISO);
}

/** Age ရက် (မွေးနေ့မှ ဒီနေ့ထိ) */
export function getAge(birthdayISO: string, onDate?: Date): number {
  const b = new Date(birthdayISO);
  const now = onDate ?? new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

// ============================================================
// Time Helpers
// ============================================================

/** နှုတ်ခွန်းဆက်စကား (အချိန်အလိုက်) */
export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'မင်္ဂလာနံနက်ခင်းပါ';
  if (h < 17) return 'မင်္ဂလာနေ့လည်ခင်းပါ';
  return 'မင်္ဂလာညနေခင်းပါ';
}

// ============================================================
// ID Generator
// ============================================================

/** Unique ID ဖန်တီး */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================
// String Helpers
// ============================================================

/** XSS ကာကွယ်ရန် HTML escape */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
}

// ============================================================
// Class Name Helper (Tailwind)
// ============================================================

/** Conditional className ပေါင်းစည်း */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
