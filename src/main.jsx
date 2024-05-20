import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Login } from './components/Login'
import { RegistrarSucursalForm } from './components/Sucursal/RegistrarSucursalForm'
import { RegisterClientForm } from './components/user/client/RegisterClientForm'
import { PostPublicationForm } from './components/publicaciones/PostPublicationForm'
import { MostrarPerfil } from './components/Perfil/ConseguirPerfil'
import { ProfileEditor } from './components/Perfil/ProfileEditor'
import { DetallesPublicacion } from './components/DetallesPublicacion/VistaPublicacion'
import { ListadoPublicaciones } from './components/Listado-Pub-Aceptacion/ListadoPubAceptacion'
import { RegisterWorkerForm } from './components/user/worker/RegisterWorkerForm'
import Layout from './components/Layout/Layout'

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
          <Route path="/mi_perfil" element={<MostrarPerfil />} />
          <Route path="/listado_publicaciones" element={<ListadoPublicaciones />} />
          <Route path="/listado_publicaciones/:id" element={<DetallesPublicacion />} />
          <Route path="/mi_perfil/editar_perfil/:dni" element={<ProfileEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
