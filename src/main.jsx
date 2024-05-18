import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login } from './components/Login.jsx'
import { RegistrarSucursalForm } from './components/Sucursal/RegistrarSucursalForm.jsx'
import { RegisterClientForm } from './components/user/client/RegisterClientForm.jsx'
import { PostPublicationForm } from './components/publicaciones/PostPublicationForm.jsx'
import { MostrarPerfil } from './components/Perfil/ConseguirPerfil.jsx'
import { DetallesPublicacion } from './components/DetallesPublicacion/VistaPublicacion.jsx'
import { ListadoPublicaciones } from './components/Listado-Pub-Aceptacion/ListadoPubAceptacion.jsx'
import { RegisterWorkerForm } from './components/user/worker/RegisterWorkerForm.jsx'
import UnauthorizedAccessPage from './components/Error/Unauthorized.jsx'
import Layout from './components/Layout/Layout.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1> hola </h1>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/sucursal',
    element: <RegistrarSucursalForm />
  },
  {
    path: '/registrar/cliente',
    element: <RegisterClientForm />
  },
  {
    path: '/registrar/empleado',
    element: <RegisterWorkerForm />
  },
  {
    path: '/agregar_publicacion',
    element: (
      <Layout>
        {' '}
        <PostPublicationForm />{' '}
      </Layout>
    )
  },
  {
    path: '/mi_perfil',
    element: <MostrarPerfil />
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedAccessPage />
  },
  {
    path: '/ver_detalles',
    element: <DetallesPublicacion />
  },
  {
    path: '/listado_publicaciones',
    element: (
      <Layout>
        {' '}
        <ListadoPublicaciones />{' '}
      </Layout>
    )
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      {' '}
      <Layout />{' '}
    </RouterProvider>
  </React.StrictMode>
)
