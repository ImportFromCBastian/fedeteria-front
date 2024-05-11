import { useEffect, useState } from 'react'
import { Publicacion } from './Publicacion'

function ListadoPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/publicaciones`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setPublicaciones(data.data)
      })
      .catch((error) => console.error('Error al obtener el listado de publicaciones:', error))
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

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
      <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
        Publicaciones pendientes de revisión
      </h2>
      <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
        Revisa y toma acciones sobre las publicaciones enviadas por los usuarios.
      </p>
      <div className="space-y-4">
        {publicaciones.length === 0 ? (
          <p>No hay publicaciones que aceptar!</p>
        ) : (
          publicaciones.map((pub, index) => (
            <Publicacion
              publicationName={pub.nombre}
              key={index}
              onDelete={() => eliminarPublicacion(pub.idPublicacion)}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default ListadoPublicaciones
