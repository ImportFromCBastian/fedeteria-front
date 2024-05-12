import React from 'react'
import { Header } from './Header'

// Define el color principal y el color de fondo
export const mainColor = '#E7AB12'
const background = '#E7AB12'

const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        // Establece la imagen de fondo y aplica el filtro de color
        backgroundImage: `url("oscuro.png")`
      }}
    >
      <div className="absolute inset-0 bg-opacity-0" style={{ backgroundColor: background }}></div>
      <Header />
      <div className="py-8">{children}</div>
    </div>
  )
}

export default Layout
