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
          DEFAULT: 'var(--ambergold-500, #F59E0B)',
          50: '#FFFBEB',
          400: 'var(--ambergold-400, #FBBF24)',
          500: 'var(--ambergold-500, #F59E0B)',
          600: '#D97706',
          700: '#B45309'
        },
        obsidian: {
          950: 'var(--obsidian-950, #07080B)',
          900: 'var(--obsidian-900, #0A0C10)',
          800: 'var(--obsidian-800, #0E1117)',
          700: 'var(--obsidian-700, #141820)',
          600: 'var(--obsidian-600, #1A1F28)',
          text: 'var(--obsidian-text, #F0F6FC)',
          muted: 'var(--obsidian-muted, #9AA3B2)',
          accent: 'var(--obsidian-accent, #F59E0B)',
          border: 'var(--obsidian-border, #1E232D)'
        }
      },
      boxShadow: {
        'focus-aaa': '0 0 0 3px rgba(245, 158, 11, 0.65), 0 0 0 6px rgba(245, 158, 11, 0.18)',
        'ruler-glow': '0 0 15px 3px rgba(245, 158, 11, 0.45)',
        'dock': '0 12px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px var(--obsidian-border)',
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
