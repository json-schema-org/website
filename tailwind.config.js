module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,md}',
    './components/**/*.{js,ts,jsx,tsx,md}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      ab1:'890px'

    },
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      sm: '0.8rem',
      base: '16px',
      xl: '20px',
      'h5': '20px',
      'h4': '25px',
      'h3': '35px',
      'h2': '45px',
      'h1': '60px',
      'h1mobile': '35px',
      'h2mobile': '28px',
      'h3mobile': '25px',
      'h4mobile': '22px',
      'h5mobile': '20px'
    },
   
    extend: {
      backgroundImage: {
        'gradient-radial': 'linear-gradient(72.68deg, #002CC4 28.97%, #5468FF 145.47%)',
      },
      colors: {
     
        white: '#ffffff',
        black: '#000000',
        primary: '#002CC4',
        btnOrange: '#F47A08',
        btnGold: '#AB9700',
        startBlue: '#002CC4',
        endBlue: '#5468FF',
        linkBlue: '#3B82F6'
      },
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
        ],
        'xl': ' 0px 6px 10px -4px rgba(0, 0, 0, 0.25);'
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