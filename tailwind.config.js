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
        'fede-main-claro': '#F0BF42',
        'fede-secundary': '#000000',
        'fede-secundary-claro': '#1c1c1b',
        'fede-texto-claro': '#FFFFFF',
        'fede-texto-base': '#FFFFFF'
        //231C07 marron oscuro cute
      }
    }
  },
  plugins: []
}
