/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c2562f',   // clay / terracotta accent
          dark: '#9c3f1f',
          ink: '#191512',       // near-black warm
          muted: '#8a807a',
          cream: '#f5efe6',     // page background
          sand: '#ece3d6',      // soft panels
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 10px 30px rgba(25,21,18,0.06)',
        cardHover: '0 24px 50px rgba(25,21,18,0.14)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRev: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        marquee: 'marquee 24s linear infinite',
        marqueeRev: 'marqueeRev 30s linear infinite',
        float: 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        'spin-rev': 'spin 22s linear infinite reverse',
      },
    },
  },
  plugins: [],
}
