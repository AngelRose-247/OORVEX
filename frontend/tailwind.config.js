/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        heritage: {
          // Exact required colors from specification
          forest: '#31543E',          // Navbar, art-form titles, nature accents
          deepGreen: '#103B30',       // Hero section background
          darkGreen: '#092A22',       // Footer dark green / deep background
          ivory: '#F6F0E4',           // Page background (Warm ivory)
          kasavuGold: '#C9A45C',      // Buttons (Kasavu gold)
          kasavuGoldDark: '#B28E46',  // Hover button state
          muralRed: '#9E4035',        // Cultural highlights / laterite terracotta
          cardIvory: '#FFFCF5',       // Cards white / warm ivory
          footerGreen: '#092A22',     // Footer dark green

          // Semantic aliases
          cream: '#FFFCF5',
          palm: '#E8D8B8',
          palmLite: '#F3EAD7',
          terracotta: '#9E4035',
          terracottaDark: '#7D2E25',
          maroon: '#6B2420',
          maroonDark: '#501714',
          templeGreen: '#31543E',
          templeGreenDark: '#203A2B',
          gold: '#C9A45C',
          goldLight: '#E2C37E',
          goldDark: '#9C7A34',
          timber: '#2B1E16',
          charcoal: '#141210',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Cinzel', '"Noto Serif Malayalam"', 'Georgia', 'serif'],
        sans: ['Manrope', '"Plus Jakarta Sans"', 'Inter', '"Noto Sans Malayalam"', 'sans-serif'],
        malayalam: ['"Noto Serif Malayalam"', '"Noto Sans Malayalam"', 'Manjari', 'sans-serif'],
      },
      boxShadow: {
        'kasavu': '0 4px 20px -2px rgba(201, 164, 92, 0.32)',
        'mural': '0 6px 24px -4px rgba(158, 64, 53, 0.25)',
        'nalukettu': '0 10px 30px -8px rgba(43, 30, 22, 0.12)',
        'nalukettu-lg': '0 20px 40px -12px rgba(43, 30, 22, 0.18)',
        'gold-border': '0 0 0 1px rgba(201, 164, 92, 0.45)',
      },
      backgroundImage: {
        'parchment-pattern': 'radial-gradient(#C6A15B 0.75px, transparent 0.75px)',
        'timber-grain': 'linear-gradient(180deg, #F7F0DF 0%, #E8D8B8 100%)',
      }
    },
  },
  plugins: [],
}
