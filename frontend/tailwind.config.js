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
          dark: '#071B17',       // Dark emerald
          forest: '#102B24',     // Deep forest green
          moss: '#193F36',       // Mid-forest green
          gold: '#D6B46A',       // Antique gold
          goldLight: '#F3DC9B',  // Light gold
          goldDark: '#A68434',   // Deep burnished gold
          ivory: '#F4EBD9',      // Warm ivory
          ivoryLight: '#FAF5ED', // Clean ivory
          charcoal: '#121615',   // Charcoal backdrop
          terracotta: '#B65338', // Traditional mural terracotta
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Noto Serif Malayalam', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'Noto Sans Malayalam', 'sans-serif'],
        malayalam: ['Manjari', 'Gayathri', 'Noto Sans Malayalam', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(214, 180, 106, 0.35)',
        'gold-subtle': '0 4px 20px -2px rgba(214, 180, 106, 0.15)',
        'emerald-deep': '0 20px 40px -15px rgba(7, 27, 23, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mural-pattern': "radial-gradient(#D6B46A 0.75px, transparent 0.75px)",
      }
    },
  },
  plugins: [],
}
