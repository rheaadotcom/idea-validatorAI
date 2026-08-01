/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c7d7fe',
          300: '#a4bcfd',
          400: '#7a96fc',
          500: '#5364f7',
          600: '#3b43ec',
          700: '#2f33d4',
          800: '#282bb0',
          900: '#25298c',
          950: '#171954',
        },
        accent: {
          emerald: '#10b981',
          purple: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
        },
        dark: {
          bg: '#09090b',
          card: '#111113',
          border: '#1e2230',
          hover: '#191c28',
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 20px rgba(16,185,129,0.6)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.6)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.6)',
        'card-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.3)',
        'glow-primary': '0 0 25px -5px rgba(59, 67, 236, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
    },
  },
  plugins: [],
};
