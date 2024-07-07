import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslateRole } from '../Perfil/useTranslateRole'
import { Exchange } from './Exchange'

export const ListarTruequesDeMiSucursal = () => {
  const [truequesINFO, setTruequesINFO] = useState([])
  const [perfil, setPerfil] = useState({
    DNI: '',
    nombre: '',
    apellido: '',
    nombreSucursal: '',
    fechaNacimiento: '',
    mail: '',
    idLocal: 0,
    rol: ''
  })
  const [sucursales, setSucursales] = useState([])
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('')
  const [filtroEstado, setFiltroEstado] = useState(null) // Estado para filtrar trueques por estado
  const navigate = useNavigate()

  const decodeToken = async (token) => {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => data.data)
      .catch((e) => new Error(e))
  }

  const transformFetch = async (rol, dni) => {
    const translate = useTranslateRole(rol)
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/${translate}/${dni}`)
      .then((response) => response.json())
      .catch((e) => {
        console.log(e)
      })
  }

  const fetchSucursales = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal`)
      if (!response.ok) {
        throw new Error('Error al obtener el listado de sucursales')
      }
      const data = await response.json()
      setSucursales(data.data)
    } catch (error) {
      console.error('Error al obtener el listado de sucursales:', error)
    }
  }

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token === null) {
          navigate('/')
          return
        }
        const decodedToken = await decodeToken(token)
        if (decodedToken.rol !== 'empleado' && decodedToken.rol !== 'administrador') {
          navigate('/unauthorized')
          return
        }
        const { data } = await transformFetch(decodedToken.rol, decodedToken.DNI)
        if (!data || data.ok) {
          throw new Error('Error al obtener los datos del usuario')
        }
        setPerfil({
          DNI: data.DNI,
          nombre: data.nombre,
          apellido: data.apellido,
          nombreSucursal: data.nombreSucursal,
          fechaNacimiento: data.fechaNacimiento,
          mail: data.mail,
          idLocal: data.idLocal,
          rol: decodedToken.rol
        })
        if (decodedToken.rol === 'empleado' || decodedToken.rol === 'administrador') {
          await obtenerTruequesPorSucursal(data.idLocal)
        }
      } catch (error) {
        console.error('Error al obtener datos de usuario y trueques:', error)
      }
    }

    obtenerDatosUsuario()
    fetchSucursales()
  }, [])

  const handleSucursalChange = async (event) => {
    const selectedIdLocal = event.target.value
    setSucursalSeleccionada(selectedIdLocal)
    await obtenerTruequesPorSucursal(selectedIdLocal)
  }

  const obtenerTruequesPorSucursal = async (idLocal) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/trueques/truequeLocal/${idLocal}`
      )
      if (!response.ok) {
        throw new Error('Error al obtener los trueques')
      }
      const trueques = await response.json()
      trueques.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      setTruequesINFO(trueques)
    } catch (error) {
      console.error('Error al obtener los trueques:', error)
    }
  }

  const handleFiltrarPorEstado = (estado) => {
    setFiltroEstado(estado === filtroEstado ? null : estado)
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <h2 className="pl-6 pt-4 text-3xl font-bold tracking-tighter md:text-4xl">
        Trueques por sucursal
      </h2>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed ">Revisá los trueques.</p>
      {perfil.rol === 'administrador' && (
        <form className="pl-6 pt-4">
          <label htmlFor="sucursal">Seleccionar Sucursal:</label>
          <select
            id="sucursal"
            name="sucursal"
            value={sucursalSeleccionada}
            onChange={handleSucursalChange}
            className="ml-2 rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Seleccionar...</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.idLocal} value={sucursal.idLocal}>
                {sucursal.nombre} - {sucursal.calle} {sucursal.numero}
              </option>
            ))}
          </select>
        </form>
      )}

      {/* Controles de filtro por estado */}
      <div className="pl-6 pt-4">
        <p>Filtrar por estado:</p>
        <button
          className={`mb-2 mr-2 rounded-md px-3 py-1 ${
            filtroEstado === null ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFiltrarPorEstado(null)}
        >
          Todas
        </button>
        <button
          className={`mb-2 mr-2 rounded-md px-3 py-1 ${
            filtroEstado === 0 ? 'bg-fede-rojo text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFiltrarPorEstado(0)}
        >
          Cancelado
        </button>
        <button
          className={`mb-2 mr-2 rounded-md px-3 py-1 ${
            filtroEstado === 1 ? 'bg-fede-verde text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFiltrarPorEstado(1)}
        >
          Realizado
        </button>
        <button
          className={`mb-2 mr-2 rounded-md px-3 py-1 ${
            filtroEstado === 3 ? 'bg-fede-amarillo text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFiltrarPorEstado(3)}
        >
          En Proceso
        </button>
      </div>

      <div className="space-y-4 py-1 pl-6">
        {truequesINFO.length === 0 ? (
          <p>No hay trueques en esta sucursal!</p>
        ) : (
          truequesINFO
            .filter((trueque) => filtroEstado === null || trueque.realizado === filtroEstado)
            .map((trueque, index) => (
              <Exchange
                key={index}
                mainPublicationID={trueque.productoDeseado}
                publicationCount={trueque.countPublication}
                exchangeID={trueque.idTrueque}
                state={trueque.realizado}
              />
            ))
        )}
      </div>
    </section>
  )
}
