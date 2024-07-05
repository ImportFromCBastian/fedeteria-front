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
        'fede-hover-button': '#ebba3d',
        'fede-secundary': '#FFFFFF     ',
        'fede-fondo-texto': '#f0eded',
        'fede-texto-claro': ' #808080', //placeholder
        'fede-texto-input': '#000000',
        'fede-texto-base': '#000000  ',
        'fede-rojo': '#FF9380', // Rojo
        'fede-verde': '#AFE0A8', // Verde
        'fede-azul': '#AFD9FD', // Azul
        'fede-amarillo': '#FFE88B' // Amarillo
        //231C07 marron oscuro cute
      }
    }
  },

  plugins: []
}
