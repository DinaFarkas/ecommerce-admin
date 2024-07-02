const { getRedirectError } = require('next/dist/client/components/redirect')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
  ],
  theme: {
    extend: {
      colors: {
        lil: '#EEB5EB',
        lil0: '#F6DAF5',
        lil1: '#DF70D9',
        orc:'#C26DBC',
        orc0:'#E1B8DE',
        orc1:'#AA47A3',
        blugre: '#3CACAE',
        blugre0: '#9DDCDD',
        blugre1: '#308A8C',
        tur: '#B5EAF0',
        tur0: '#E3F9FC',
        tur1: '#77E4F0',

      },
    },
  },
  plugins: [],
}