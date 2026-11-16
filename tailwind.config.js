/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#090909',
          charcoal: '#171717',
          surface: '#1F1F1F',
          border: '#2E2E2E',
          cream: '#F7F6F2',
          muted: '#8E8E8E',
          gold: '#C6A45C',
          'gold-light': '#D4BA7D',
          'gold-dark': '#A3843E',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'Outfit', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.15em',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'luxury-hover': '0 30px 60px -12px rgba(0, 0, 0, 0.15)',
        'gold-glow': '0 0 25px rgba(198, 164, 92, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
