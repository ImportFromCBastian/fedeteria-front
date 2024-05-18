/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'fede-background': "url('/public/big fondo.png')"
      },
      colors: {
        'fede-main': '#E7AB12',
        'fede-main-claro': '#FFF9E3',
        'fede-secundary': '#2B2B2B     ',
        'fede-fondo-texto': '#7F7F7F    ',
        'fede-texto-claro': '#FFFFFF',
        'fede-texto-base': '#FFFFFF  '
        //231C07 marron oscuro cute
      }
    }
  },
  plugins: []
}
