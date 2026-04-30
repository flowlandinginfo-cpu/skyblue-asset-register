import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SkyBlue Construction brand
        skyblue: {
          50:  '#e8f4fd',
          100: '#c5e3f6',
          200: '#9dcfef',
          300: '#6db8e6',
          400: '#47a5de',
          500: '#2E86C1', // secondary
          600: '#2574a8',
          700: '#1A5276', // primary dark
          800: '#143f5c',
          900: '#0e2d42',
        },
        accent: {
          DEFAULT: '#F39C12',
          light:   '#f5b041',
          dark:    '#d68910',
        },
        // Status colors
        status: {
          active:   '#16a34a',
          repair:   '#ca8a04',
          inactive: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Sarabun', 'Noto Sans Thai', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
