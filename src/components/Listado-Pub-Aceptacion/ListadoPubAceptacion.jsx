import { useEffect, useState } from 'react'
import { Publicacion } from './Publicacion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import enviarNotificacion from '../Notificaciones/enviarNotificacion'
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

  const fetchEliminarPublicacion = async (idPublicacion) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/ver_detalles/logicDelete/${idPublicacion}`, {
      method: 'PATCH'
    })
  }

  const notificarEliminacionExitosa = (nombre, dni) => {
    toast.success('Publicación eliminada con éxito!')
    enviarNotificacion('rechazada', `Tu publicación ${nombre} ha sido rechazada`, dni)
  }

  const actualizarListaPublicaciones = () => {
    setTimeout(() => {
      window.location.reload()
    }, 500) // 0.5 segundos de espera antes de recargar la página
  }

  const fetchPublicationData = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/publicaciones/notDeleted`)
      .then((response) => response.json())
      .then((data) => {
        setPublicaciones(data.data)
      })
      .catch((error) => console.error('Error al obtener el listado de publicaciones:', error))
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null) {
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

  const eliminarPublicacion = async (idPublicacion, dni, nombre) => {
    try {
      await fetchEliminarPublicacion(idPublicacion)
      notificarEliminacionExitosa(nombre, dni)
      actualizarListaPublicaciones()
    } catch (error) {
      console.error('Error al eliminar la publicación:', error)
    }
  }

  const aceptarPublicacion = async (idPublicacion, numero, dni, nombre) => {
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
      toast.success('Publicación aceptada con éxito!')
      setTimeout(() => {
        window.location.reload()
      }, 500) // 1 segundo de espera

      enviarNotificacion('aceptada', `Tu publicación ${nombre} ha sido aceptada`, dni)

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
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed ">
        Revisá y tomá acciones sobre las publicaciones enviadas por los usuarios.
      </p>
      <div className="space-y-4 py-1 pl-6">
        {publicaciones.length === 0 ? (
          <p>No hay publicaciones que aceptar!</p>
        ) : (
          publicaciones.map((pub, index) => (
            <Publicacion
              publicationName={pub.nombre}
              idPublicacion={pub.idPublicacion}
              key={index}
              onDelete={() => eliminarPublicacion(pub.idPublicacion, pub.DNI, pub.nombre)}
              onAccept={(numero) =>
                aceptarPublicacion(pub.idPublicacion, numero, pub.DNI, pub.nombre)
              }
            />
          ))
        )}
      </div>
    </section>
  )
}
