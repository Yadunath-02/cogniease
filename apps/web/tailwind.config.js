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
        brand: {
          DEFAULT: 'var(--brand-primary, #6366F1)',
          50: '#EEF2FF',
          400: 'var(--brand-400, #818CF8)',
          500: 'var(--brand-500, #6366F1)',
          600: 'var(--brand-600, #4F46E5)',
          700: 'var(--brand-700, #4338CA)',
          cyan: 'var(--brand-cyan, #06B6D4)',
          emerald: 'var(--brand-emerald, #10B981)'
        },
        obsidian: {
          950: 'var(--obsidian-950, #06090E)',
          900: 'var(--obsidian-900, #0B0F17)',
          800: 'var(--obsidian-800, #111827)',
          700: 'var(--obsidian-700, #1F2937)',
          600: 'var(--obsidian-600, #374151)',
          text: 'var(--obsidian-text, #F9FAFB)',
          muted: 'var(--obsidian-muted, #9CA3AF)',
          accent: 'var(--brand-500, #6366F1)',
          border: 'var(--obsidian-border, #1F2937)'
        }
      },
      boxShadow: {
        'focus-aaa': '0 0 0 3px rgba(99, 102, 241, 0.65), 0 0 0 6px rgba(99, 102, 241, 0.18)',
        'ruler-glow': '0 0 15px 3px rgba(6, 182, 212, 0.45)',
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
