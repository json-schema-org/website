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
      white: '#ffffff',
      primary: '#002CC4',
      btnOrange: '#F47A08',
      btnGold: '#AB9700',
      startBlue: '#052FC7',
      endBlue: '#5468FF'
    },
    extend: {
      lineHeight: {
        'base': '24px',
        'header': '74px',
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
