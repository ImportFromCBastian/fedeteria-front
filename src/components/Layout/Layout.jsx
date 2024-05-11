import React from 'react'
import { Header } from './Header'

const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("background4.png")' }}
    >
      <Header />
      <div className="py-8">{children}</div>
    </div>
  )
}

export default Layout
