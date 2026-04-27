/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#edf6ff',
          100: '#d6eaff',
          200: '#b5d8ff',
          300: '#83beff',
          400: '#4a9bff',
          500: '#1a73f5',
          600: '#0d55e0',
          700: '#0a40b8',
          800: '#0e3796',
          900: '#0c2f7a',
          950: '#091d52',
        },
        earth: {
          50:  '#f5f3ee',
          100: '#e8e3d5',
          200: '#d3c9ae',
          300: '#b9a880',
          400: '#a28f5e',
          500: '#8d784a',
          600: '#79633e',
          700: '#614e34',
          800: '#51402e',
          900: '#46382b',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'grid-move': 'gridMove 20s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gridMove: {
          '0%': { transform: 'translate(0,0)' },
          '100%': { transform: 'translate(40px, 40px)' },
        },
      },
    },
  },
  plugins: [],
}
