import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFotosUrls } from '../../utils/fotoUtils'
import getCategory from '../../utils/useConversor'

export const Publication = ({ publication }) => {
  const [fotoUrl, setFotoUrl] = useState('') // Estado para la URL de la foto
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const urls = await fetchFotosUrls(publication.idPublicacion)
        if (urls.length > 0) {
          setFotoUrl(urls[0]) // Usa la primera foto como la principal
        }
      } catch (error) {
        console.error('Error al obtener las fotos:', error)
      }
    }

    fetchFotos()
  }, [publication.idPublicacion]) // Solo se ejecuta cuando el ID de la publicación cambia

  const handleClick = () => {
    navigate('/ver_publicacion/' + publication.idPublicacion)
  }

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
      <span onClick={handleClick} className="absolute inset-0 z-10" href="#">
        <span className="sr-only">View</span>
      </span>
      {fotoUrl ? ( // Si hay una URL de foto, muestra la imagen
        <img
          src={fotoUrl}
          alt={publication.nombre}
          width="300"
          height="300"
          className="aspect-square h-64 w-full bg-white object-contain"
        />
      ) : (
        // Si no hay una URL de foto, muestra un texto de carga
        <div className="mr-4 flex aspect-square  h-64 w-full items-center justify-center bg-gray-200 object-cover text-xl">
          Cargando...
        </div>
      )}
      <div className=" bg-gray-950 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{publication.nombre}</h3>
          <span className="text-sm font-medium text-gray-500">
            {getCategory(publication.precio)}
          </span>
        </div>
        <p className="text-sm text-gray-500">{publication.estado}</p>
      </div>
    </div>
  )
}
