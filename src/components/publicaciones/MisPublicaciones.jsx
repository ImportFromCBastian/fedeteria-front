import { toast, Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Publication } from './Publication'

export const MisPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([])
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
      setPublicaciones(data) // Actualiza el estado con el arreglo de publicaciones
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
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-4 text-2xl font-bold">
        {publicaciones.length > 0 ? 'Estas son tus publicaciones' : 'No tienes publicaciones'}
      </h2>
      <div>
        <Toaster position="bottom-right" />
        <section className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 md:p-6 lg:grid-cols-4">
          {publicaciones.length > 0 ? (
            publicaciones.map((publication, index) => (
              <Publication key={index} publication={publication} onError={handleError} />
            ))
          ) : (
            <p className="text-center text-gray-600">Aún no has publicado nada.</p>
          )}
        </section>
      </div>
    </div>
  )
}
