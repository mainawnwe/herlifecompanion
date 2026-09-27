/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mm: ['"Noto Sans Myanmar"', 'sans-serif'],
        en: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
          soft: '#EFF6FF',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        accent: {
          DEFAULT: '#7C3AED',
          soft: '#F5F3FF',
          light: '#C4B5FD',
        },
        cyanx: {
          DEFAULT: '#06B6D4',
          soft: '#ECFEFF',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          subtle: '#94A3B8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          dark: '#0F172A',
        },
        border: '#E2E8F0',
        bg: '#F8FAFC',
      },
      boxShadow: {
        soft: '0 4px 20px -6px rgba(15,23,42,0.08)',
        card: '0 2px 12px -4px rgba(15,23,42,0.06)',
        premium: '0 20px 40px -12px rgba(37,99,235,0.25)',
        glow: '0 0 20px -4px rgba(37,99,235,0.4)',
      },
      borderRadius: {
        xl2: '18px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};