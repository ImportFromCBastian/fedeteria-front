// Layout.js
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

const Layout = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-fede-background bg-cover bg-center bg-repeat">
        <div className="min-h-screen bg-orange-100 bg-opacity-90 bg-cover bg-center bg-repeat-y">
          <Outlet />
        </div>
      </div>
    </>
  )
}
export default Layout
