import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFotosUrls } from '../../utils/fotoUtils'
import getCategory from '../../utils/useConversor'

export const ProductsExchange = ({ onChildChange, publication, index }) => {
  const [style, setStyle] = useState(
    'group relative flex items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl'
  )
  const [selected, setSelected] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(null) // Inicializa con null para indicar que la URL de la foto aún no se ha cargado
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFoto = async () => {
      try {
        const urls = await fetchFotosUrls(publication.idPublicacion)
        if (urls.length > 0) {
          setPhotoUrl(urls[0]) // Usa la primera foto como la principal
        }
      } catch (error) {
        console.error('Error fetching photos:', error)
      }
    }

    fetchFoto()
  }, [publication.idPublicacion])

  const handleClick = () => {
    if (selected) {
      setStyle(
        'group relative flex items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl'
      )
      onChildChange(index, 'remove')
    } else {
      setStyle(
        'group relative flex items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl border-2 rounded border-fede-main'
      )
      onChildChange(index, 'add')
    }
    setSelected(!selected)
  }

  return (
    <div onClick={handleClick} className={style}>
      {photoUrl ? ( // Si hay una URL de foto, muestra la imagen
        <img
          src={photoUrl}
          alt={`Producto ${publication.nombre}`}
          width="100"
          height="100"
          className="aspect-square overflow-hidden rounded-lg border  object-cover "
        />
      ) : (
        // Si no hay una URL de foto, muestra un texto de carga
        <div className="mr-4 flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200 text-xs">
          Cargando...
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold">{publication.nombre}</h3>
        <p className="text-sm text-gray-500 ">{publication.descripcion}</p>
        <p className="text-sm text-gray-500 ">Categoría: {getCategory(publication.precio)}</p>
      </div>
    </div>
  )
}
