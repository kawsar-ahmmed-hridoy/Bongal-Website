/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main organic green palette
        primary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        // Fresh lime accent
        accent: {
          50: '#F1F8E9',
          100: '#DCEDC8',
          200: '#C5E1A5',
          300: '#AED581',
          400: '#9CCC65',
          500: '#8BC34A',
          600: '#7CB342',
          700: '#689F38',
          800: '#558B2F',
          900: '#33691E',
        },
        // Natural cream/off-white
        cream: {
          50: '#FEFEFE',
          100: '#FCFCF7',
          200: '#F9F9F4',
          300: '#F7F7F2',
          400: '#F5F5F0',
          500: '#F3F3ED',
          600: '#E8E8E2',
          700: '#DCDCD6',
          800: '#D0D0CA',
          900: '#C4C4BE',
        },
        // Earth tones for organic feel
        earth: {
          50: '#EFEBE9',
          100: '#D7CCC8',
          200: '#BCAAA4',
          300: '#A1887F',
          400: '#8D6E63',
          500: '#795548',
          600: '#6D4C41',
          700: '#5D4037',
          800: '#4E342E',
          900: '#3E2723',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(46, 125, 50, 0.1), 0 4px 6px -2px rgba(46, 125, 50, 0.05)',
        'soft-lg': '0 10px 30px -5px rgba(46, 125, 50, 0.15), 0 8px 10px -5px rgba(46, 125, 50, 0.08)',
      },
    },
  },
  plugins: [],
}

