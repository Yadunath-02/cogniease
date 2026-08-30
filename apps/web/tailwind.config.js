/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
        lexend: ['Lexend', 'Inter', 'sans-serif'],
        atkinson: ['Atkinson Hyperlegible', 'sans-serif'],
        sans: ['Inter', 'Lexend', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        ui: ['Inter', 'Lexend', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
        serif: ['Merriweather', 'Georgia', 'serif']
      },
      colors: {
        ambergold: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309'
        },
        obsidian: {
          950: '#07080B',
          900: '#0A0C10',
          800: '#0E1117',
          700: '#141820',
          600: '#1A1F28',
          text: '#F0F6FC',
          muted: '#9AA3B2',
          accent: '#F59E0B',
          border: '#1E232D'
        },
        sepia: {
          bg: '#FBF0D9',
          card: '#F4E4C1',
          text: '#2D2319',
          muted: '#5E4D3B',
          accent: '#8C4300',
          border: '#E2CC9C'
        },
        mint: {
          bg: '#EBF7EE',
          card: '#D7EFE0',
          text: '#132B1A',
          muted: '#366141',
          accent: '#1A6335',
          border: '#BBE0C7'
        },
        irlen: {
          bg: '#E6F0FA',
          card: '#D0E3F7',
          text: '#0E2338',
          muted: '#335C80',
          accent: '#1D4ED8',
          border: '#A8CBF0'
        },
        contrast: {
          bg: '#000000',
          card: '#121212',
          text: '#FFE600',
          muted: '#00FFFF',
          accent: '#00FFFF',
          border: '#FFE600'
        }
      },
      boxShadow: {
        'focus-aaa': '0 0 0 3px rgba(245, 158, 11, 0.65), 0 0 0 6px rgba(245, 158, 11, 0.18)',
        'ruler-glow': '0 0 15px 3px rgba(245, 158, 11, 0.45)',
        'dock': '0 12px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px #1E232D',
        'bento': '0 8px 28px rgba(0, 0, 0, 0.35)'
      },
      minHeight: {
        touch: '44px'
      },
      minWidth: {
        touch: '44px'
      }
    },
  },
  plugins: [],
}
