import React, { useEffect, useState } from 'react'

function ListadoPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/publicaciones`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setPublicaciones(data.data)
        setLoading(false)
      })
      .catch((error) => console.error('Error al obtener el listado de publicaciones:', error))
  }, [])

  return (
    <div>
      <h2>Listado de Publicaciones</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : publicaciones.length === 0 ? (
        <p>No hay publicaciones por aprobar.</p>
      ) : (
        <ul>
          {publicaciones.map((publicaciones, index) => (
            <li key={index}> {publicaciones.nombre} </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ListadoPublicaciones
