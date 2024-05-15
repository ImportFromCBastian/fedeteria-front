// Layout.js
import React from 'react'
import { Header } from './Header'

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-fede-background bg-cover bg-center bg-repeat">
        <div className="min-h-screen bg-orange-100 bg-opacity-90 bg-cover bg-center bg-repeat-y">
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout
