/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,md}',
    './components/**/*.{js,ts,jsx,tsx,md}',
  ],
  theme: {
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      sm: '0.8rem',
      base: '16px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '50px',
      '5xl': '65px',
    },
    colors: {
      ...colors,
      white: '#ffffff',
      black: '#000000',
      primary: '#002CC4',
      btnOrange: '#F47A08',
      btnGold: '#AB9700',
      startBlue: '#052FC7',
      endBlue: '#5468FF',
      linkBlue: '#3B82F6'
    },
    extend: {
      gradientColorStopPositions: {
        33: '145.47%',
      },
      lineHeight: {
        'base': '24px',
        'header': '74px',
      },
      boxShadow: {
        '3xl': ' 0px 0px 20px 5px rgba(0, 0, 0, 0.05)',
        '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.25)',
          '0 45px 65px rgba(0, 0, 0, 0.15)'
        ]
      }
    }
  },
  plugins: [],
}

/*
  FONT WEIGHT

  font-light 300
  font-normal 400 (default)
  font-medium 500
  font-semibold 600
  font-bold 700
  font-black 900
*/
