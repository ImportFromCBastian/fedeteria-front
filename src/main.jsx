import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<h1> hola </h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/sucursal" element={<RegistrarSucursalForm />} />
          <Route path="/registrar/cliente" element={<RegisterClientForm />} />
          <Route path="/registrar/empleado" element={<RegisterWorkerForm />} />
          <Route path="/agregar_publicacion" element={<PostPublicationForm />} />
          <Route path="/:id" element={<MostrarPerfil />} />
          <Route path="/listado_publicaciones" element={<ListadoPublicaciones />} />
          <Route path="/listado_publicaciones/:id" element={<DetallesPublicacion />} />
          <Route path="/unauthorized" element={<UnauthorizedAccessPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
