/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0a0f1a',
          900: '#0f1623',
          800: '#16202e',
          700: '#1f2d3f',
          600: '#2c3e54',
        },
        brand: {
          50: '#eefcf6',
          100: '#d4f6e8',
          200: '#aceed4',
          300: '#74e0ba',
          400: '#3ccb99',
          500: '#16b07e',
          600: '#0c8e66',
          700: '#0a7253',
          800: '#0b5b44',
          900: '#0a4a39',
        },
        accent: {
          400: '#fbb454',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(22, 176, 126, 0.45)',
        card: '0 10px 30px -12px rgba(10, 15, 26, 0.35)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, rgba(10,15,26,0) 0%, rgba(10,15,26,0.9) 70%, #0a0f1a 100%)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};
