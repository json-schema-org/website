module.exports = {
  mode: 'jit', // Enable JIT mode
  content: [
    './pages/**/*.{js,ts,jsx,tsx,md}',
    './components/**/*.{js,ts,jsx,tsx,md}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      ab1: '890px',
    },
    fontFamily: {
      sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui'],
      serif: ['var(--font-serif)', 'ui-serif', 'Georgia'],
      mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      sm: '0.8rem',
      base: ['1rem', { lineHeight: '1.75' }],
      xl: ['1.25rem', { lineHeight: '1.75' }],
      h5: ['1.25rem', { lineHeight: '1.6', letterSpacing: '-0.005em' }],
      h4: ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
      h3: ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      h2: ['2.625rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
      h1: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      h1mobile: ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      h2mobile: ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.018em' }],
      h3mobile: ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
      h4mobile: ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      h5mobile: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.005em' }],
    },

    extend: {
      keyframes: {
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
      },
      animation: {
        'collapsible-down': 'collapsible-down 0.5s ease-in-out',
        'collapsible-up': 'collapsible-up 0.5s ease-in-out',
        marquee: 'marquee var(--duration, 25s) linear infinite',
        'marquee-fast': 'marquee 15s linear infinite',
        'marquee-slow': 'marquee 30s linear infinite',
      },
      backgroundImage: {
        'gradient-radial':
          'linear-gradient(72.68deg, #002CC4 28.97%, #5468FF 145.47%)',
      },
      colors: {
        white: '#ffffff',
        black: '#000000',
        primary: '#002CC4',
        btnOrange: '#F47A08',
        btnGold: '#AB9700',
        startBlue: '#002CC4',
        endBlue: '#5468FF',
        linkBlue: '#3B82F6',
      },
      gradientColorStopPositions: {
        33: '145.47%',
      },
      lineHeight: {
        base: '24px',
        header: '74px',
        tight: '1.15',
        snug: '1.3',
        relaxed: '1.7',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
        tight: '-0.015em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        '3xl': ' 0px 0px 20px 5px rgba(0, 0, 0, 0.05)',
        '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.25)',
          '0 45px 65px rgba(0, 0, 0, 0.15)',
        ],
        xl: ' 0px 6px 10px -4px rgba(0, 0, 0, 0.25);',
      },
    },
  },
  plugins: [],
};

/*
  FONT WEIGHT

  font-light 300
  font-normal 400 (default)
  font-medium 500
  font-semibold 600
  font-bold 700
  font-black 900
*/
