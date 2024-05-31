import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Login } from './components/Login/Login.jsx'
import { RegistrarSucursalForm } from './components/Sucursal/RegistrarSucursalForm'
import { RegisterClientForm } from './components/user/client/RegisterClientForm'
import { PostPublicationForm } from './components/publicaciones/PostPublicationForm'
import { MostrarPerfil } from './components/Perfil/ConseguirPerfil'
import { ProfileEditor } from './components/Perfil/ProfileEditor'
import { ModificarPublicacion } from './components/publicaciones/ModificarPublicacion'
import { DetallesPublicacion } from './components/DetallesPublicacion/VistaPublicacion'
import { ListadoPublicaciones } from './components/Listado-Pub-Aceptacion/ListadoPubAceptacion'
import { RegisterWorkerForm } from './components/user/worker/RegisterWorkerForm'
import Layout from './components/Layout/Layout'
import UnauthorizedAccessPage from './components/Error/Unauthorized.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <div className="flex min-h-[100vh] items-center justify-center">
                <div className="mx-4 my-5 w-full max-w-md rounded-lg border-4 border-fede-main bg-fede-secundary p-8 shadow-md sm:mx-0">
                  <h1 className="mb-6 text-center text-2xl font-bold text-fede-texto-base">
                    ¡Bienvenido a la fedetería!
                  </h1>
                  <h3 className="text-l mb-6 text-center font-bold text-fede-texto-base">
                    ¿Estás listo para intercambiar algunos productos?
                  </h3>
                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/sucursal" element={<RegistrarSucursalForm />} />
          <Route path="/registrar/cliente" element={<RegisterClientForm />} />
          <Route path="/registrar/empleado" element={<RegisterWorkerForm />} />
          <Route path="/agregar_publicacion" element={<PostPublicationForm />} />
          <Route path="/mi_perfil" element={<MostrarPerfil />} />
          <Route path="/listado_publicaciones" element={<ListadoPublicaciones />} />
          <Route path="/listado_publicaciones/:id" element={<DetallesPublicacion />} />
          <Route path="/mi_perfil/editar_perfil/:dni" element={<ProfileEditor />} />
          <Route path="/publicaciones/editar_publicacion/:id" element={<ModificarPublicacion />} />
          <Route path="/unauthorized" element={<UnauthorizedAccessPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
