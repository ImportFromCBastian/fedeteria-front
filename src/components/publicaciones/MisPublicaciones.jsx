import { toast, Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MyPublication } from './MyPublication'

export const MisPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([])
  const [filter, setFilter] = useState(null) // Estado para el filtro
  const navigate = useNavigate()

  const decodeToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        method: 'POST'
      })
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      throw error
    }
  }

  const handleError = (message) => {
    toast.error(message)
  }

  const fetchPublicaciones = async (dni) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/publication/buscar_mis_publicaciones/${dni}`
      )
      const data = await response.json()
      const reversedPublicaciones = data.reverse()
      setPublicaciones(reversedPublicaciones) // Actualiza el estado con el arreglo de publicaciones
    } catch (error) {
      console.error('Error al obtener el listado de publicaciones:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null) {
      navigate('/')
      return
    }

    const fetchData = async () => {
      try {
        const decodedToken = await decodeToken(token)
        await fetchPublicaciones(decodedToken.DNI)
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = (estado) => {
    setFilter(estado === filter ? null : estado)
  }

  const filteredPublicaciones = publicaciones.filter((publication) => {
    if (filter === null) return true
    if (filter === 'rechazada') return publication.rechazado === 1
    if (filter === 'pendiente') return publication.precio === 0
    if (filter === 'activa') return publication.rechazado !== 1 && publication.precio !== 0
    return false
  })

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
        {publicaciones.length > 0 ? 'Estas son tus publicaciones' : 'No hay nada que mostrar'}
      </h2>
      <div>
        <Toaster position="bottom-right" />
        <div>
          <h2 className="md:text-l mb-2 pt-2 text-gray-500">Filtrar por estado:</h2>
          <button
            className={`mb-2 mr-2 rounded-md px-3 py-1 ${
              filter === null ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFilterChange(null)}
          >
            Todas
          </button>
          <button
            className={`mb-2 mr-2 rounded-md px-3 py-1 ${
              filter === 'activa' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFilterChange('activa')}
          >
            Activas
          </button>
          <button
            className={`mb-2 mr-2 rounded-md px-3 py-1 ${
              filter === 'pendiente' ? 'bg-fede-amarillo text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFilterChange('pendiente')}
          >
            Pendientes de revisión
          </button>
          <button
            className={`mb-2 mr-2 rounded-md px-3 py-1 ${
              filter === 'rechazada' ? 'bg-fede-rojo text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFilterChange('rechazada')}
          >
            Rechazadas
          </button>
        </div>
        <section className="space-y-4 py-1 ">
          {filteredPublicaciones.length > 0 ? (
            filteredPublicaciones.map((publication, index) => (
              <MyPublication key={index} publication={publication} onError={handleError} />
            ))
          ) : (
            <p className="text-center text-gray-600">Nada para mostrar</p>
          )}
        </section>
      </div>
    </div>
  )
}
