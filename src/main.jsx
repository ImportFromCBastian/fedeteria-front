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
import { HomePage } from './components/Home/HomePage'
import { SuggestExchange } from './components/Exchanges/SuggestExchange'
import Layout from './components/Layout/Layout'
import UnauthorizedAccessPage from './components/Error/Unauthorized.jsx'
import { RecuperarContraseña } from './components/RecuperacionContraseña/recuperarContraseña.jsx'
import { ListarSucursales } from './components/Layout/Listar-Sucursales/ListarSucursales.jsx'
import { SuggestedExchangesList } from './components/MySuggestionsList/SuggestedExchangesList.jsx'
import { SuggestDetail } from './components/MySuggestionsList/SuggestDetatil.jsx'
import { ActiveExchanges } from './components/ActiveExchanges/ActiveExchanges.jsx'
import { RegisterDetailsModal } from './components/MyExchangesList/RegisterDetailsModal.jsx'
import { MisPublicaciones } from './components/publicaciones/MisPublicaciones.jsx'
import { ExchangesList } from './components/MyExchangesList/ExchangesList.jsx'
import { ExchangeDetails } from './components/MyExchangesList/ExchangeDetails.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sucursal" element={<RegistrarSucursalForm />} />
          <Route path="/registrar/cliente" element={<RegisterClientForm />} />
          <Route path="/registrar/empleado" element={<RegisterWorkerForm />} />
          <Route path="/agregar_publicacion" element={<PostPublicationForm />} />
          <Route path="/mi_perfil" element={<MostrarPerfil />} />
          <Route path="/listado_publicaciones" element={<ListadoPublicaciones />} />
          <Route path="/recuperar_contraseña" element={<RecuperarContraseña />} />
          <Route path="/listado_publicaciones/:id" element={<DetallesPublicacion />} />
          <Route path="/ver_publicacion/:id" element={<DetallesPublicacion />} />
          <Route path="/sugerir_trueque/:id" element={<SuggestExchange />} />
          <Route path="/mi_perfil/editar_perfil/:dni" element={<ProfileEditor />} />
          <Route
            path="/publicaciones/modificar_publicacion/:id"
            element={<ModificarPublicacion />}
          />
          <Route path="/listado_sucursales" element={<ListarSucursales />} />
          <Route path="/ver_mis_sugerencias" element={<SuggestedExchangesList />} />
          <Route path="/unauthorized" element={<UnauthorizedAccessPage />} />
          <Route path="/ver_sugerencia/:id" element={<SuggestDetail />} />
          <Route path="/mis_trueques_activos" element={<ActiveExchanges />} />
          <Route path="/registrar_detalles/:id" element={<RegisterDetailsModal />} />
          <Route path="/ver_mis_publicaciones" element={<MisPublicaciones />} />
          <Route path="/intercambios" element={<ExchangesList />} />
          <Route path="/ver_intercambio/:id" element={<ExchangeDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
