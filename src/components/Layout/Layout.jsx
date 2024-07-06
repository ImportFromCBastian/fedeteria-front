import { Outlet } from 'react-router-dom'
import { Header } from './Header'

const Layout = () => {
  return (
    <>
      <Header />
      <div style={backgroundStyle}>
        <div style={overlayStyle}>
          <Outlet />
        </div>
      </div>
    </>
  )
}

const backgroundStyle = {
  minHeight: '100vh',
  backgroundImage: "url('/public/big fondo.png')", // Asegúrate de usar la URL correcta
  backgroundSize: 'auto',
  backgroundRepeat: 'repeat-y',
  backgroundPosition: 'center top'
}

const overlayStyle = {
  minHeight: '100vh',
  backgroundColor: 'rgba(255, 237, 213, 0.9)' // Fondo naranja con opacidad del 90%
}

export default Layout
