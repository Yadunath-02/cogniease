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
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
        serif: ['Merriweather', 'Georgia', 'serif']
      },
      colors: {
        obsidian: {
          900: '#090D13',
          800: '#0D1117',
          700: '#161B22',
          600: '#21262D',
          text: '#F0F6FC',
          muted: '#8B949E',
          accent: '#58A6FF',
          border: '#30363D'
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
        'focus-aaa': '0 0 0 3px rgba(88, 166, 255, 0.6), 0 0 0 6px rgba(88, 166, 255, 0.2)',
        'ruler-glow': '0 0 15px 3px rgba(255, 215, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
