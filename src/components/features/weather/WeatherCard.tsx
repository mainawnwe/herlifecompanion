import { useState, useEffect } from 'react';
import { Card, CardTitle } from '@/components/common/Card';
import { WMO_CODES } from '@/lib/constants';
import type { WeatherData } from '@/types';

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error' | 'denied'>(
    'loading'
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const r = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
          );
          const j = await r.json();
          const code = j.current.weather_code;
          const wmo = WMO_CODES[code] ?? { emoji: '🌡️', desc: '—' };
          setWeather({
            temperature: Math.round(j.current.temperature_2m),
            humidity: j.current.relative_humidity_2m,
            code,
            description: wmo.desc,
            emoji: wmo.emoji,
          });
          setStatus('ok');
        } catch {
          setStatus('error');
        }
      },
      () => setStatus('denied'),
      { timeout: 8000 }
    );
  }, []);

  return (
    <Card>
      <CardTitle icon="🌤️">ဒီနေ့ရာသီဥတု</CardTitle>

      {status === 'loading' && (
        <div className="text-ink-muted text-sm">ရာသီဥတု ရယူနေသည်...</div>
      )}
      {status === 'denied' && (
        <div className="text-ink-muted text-sm">တည်နေရာ ခွင့်ပြုပါ 🌍</div>
      )}
      {status === 'error' && (
        <div className="text-ink-muted text-sm">ရာသီဥတု ရယူမရပါ</div>
      )}
      {status === 'ok' && weather && (
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[28px] font-bold text-ink en leading-none">
              {weather.temperature}°C
            </div>
            <div className="text-xs text-ink-muted mt-1">
              {weather.description} · စိုထိုင်းဆ {weather.humidity}%
            </div>
          </div>
          <div className="text-[44px]">{weather.emoji}</div>
        </div>
      )}
    </Card>
  );
}
