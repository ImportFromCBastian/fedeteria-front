import { useEffect, useState } from 'react'
import { Publicacion } from './Publicacion'
import { useNavigate } from 'react-router-dom'

export const ListadoPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([])
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

  const fetchPublicationData = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/publicaciones`)
      .then((response) => response.json())
      .then((data) => {
        setPublicaciones(data.data)
      })
      .catch((error) => console.error('Error al obtener el listado de publicaciones:', error))
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/')
      return
    }

    const fetchData = async () => {
      const decodedToken = await decodeToken(token)
      if (decodedToken.rol == 'cliente') {
        navigate('/')
        return
      }
      fetchPublicationData()
    }
    fetchData()
  }, [])

  const eliminarPublicacion = async (idPublicacion) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/publicaciones/${idPublicacion}`, {
      method: 'DELETE'
    })
      .then(() => {
        // Actualizar la lista de publicaciones después de eliminar
        setPublicaciones(publicaciones.filter((pub) => pub.idPublicacion !== idPublicacion))
      })
      .catch((error) => console.error('Error al eliminar la publicación:', error))
  }

  const aceptarPublicacion = async (idPublicacion, numero) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/publicaciones/${idPublicacion}`,
        {
          method: 'PUT', // O 'POST' dependiendo de cómo esté implementado en el backend
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ numero: numero }) // Envía el número como un JSON en el cuerpo de la solicitud
        }
      )

      if (!response.ok) {
        throw new Error('Error al aceptar la publicación')
      }

      // Actualizar la lista de publicaciones después de aceptar
      setPublicaciones((prevPublicaciones) =>
        prevPublicaciones.map((pub) => {
          if (pub.idPublicacion === idPublicacion) {
            // Actualizar el número de la publicación aceptada
            return { ...pub, numero: numero }
          }
          return pub
        })
      )
    } catch (error) {
      console.error('Error al aceptar la publicación:', error)
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <h2 className="pl-6 pt-4 text-3xl font-bold tracking-tighter md:text-4xl">
        Publicaciones pendientes de revisión
      </h2>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed dark:text-gray-400">
        Revisa y toma acciones sobre las publicaciones enviadas por los usuarios.
      </p>{' '}
      <div className="space-y-4 px-1 py-1">
        {publicaciones.length === 0 ? (
          <p>No hay publicaciones que aceptar!</p>
        ) : (
          publicaciones.map((pub, index) => (
            <Publicacion
              publicationName={pub.nombre}
              idPublicacion={pub.idPublicacion}
              key={index}
              onDelete={() => eliminarPublicacion(pub.idPublicacion)}
              onAccept={(numero) => aceptarPublicacion(pub.idPublicacion, numero)}
            />
          ))
        )}
      </div>
    </section>
  )
}
