/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        surface: {
          50:  '#f0f0ff',
          100: '#e0e0f8',
          800: '#0f0f1c',
          850: '#0a0a16',
          900: '#070710',
          950: '#040408',
        },
        brand: {
          400: '#9088ff',
          500: '#6c63ff',
          600: '#5548dd',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.25s ease',
        'toast-in': 'toastIn 0.25s ease',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'none' } },
        toastIn: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'none' } },
      },
    },
  },
  plugins: [],
}
