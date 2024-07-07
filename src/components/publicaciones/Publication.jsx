import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFotosUrls } from '../../utils/fotoUtils'
import getCategory from '../../utils/useConversor'
import { toast, Toaster } from 'sonner'

export const Publication = ({ publication, onError }) => {
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
    const token = localStorage.getItem('token')
    if (!token) {
      if (onError) {
        onError('Debes iniciar sesión para ver la publicación')
      }
    } else navigate('/ver_publicacion/' + publication.idPublicacion)
  }

  return (
    <div
      className={`-1 group relative overflow-hidden rounded-lg bg-gray-950 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl`}
    >
      <span onClick={handleClick} className="absolute inset-0 z-10" href="#">
        <span className="sr-only">View</span>
      </span>

      {publication.destacada === 'si' && (
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="#E7AB12" className="absolute ml-1 mt-10 h-4 w-4">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"></path>
          </svg>
          <svg viewBox="0 0 24 24" fill="#E7AB12" className="absolute ml-7 mt-10 h-4 w-4">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"></path>
          </svg>
          <svg viewBox="0 0 24 24" fill="#E7AB12" className="absolute ml-4 mt-5 h-4 w-4">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"></path>
          </svg>
        </div>
      )}
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

      <div className={`p-4 `}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{publication.nombre}</h3>
          <span className="text-base font-medium text-gray-500">
            Categoría: {getCategory(publication.precio)}
          </span>
        </div>
        <p className="text-sm text-gray-500">{publication.estado}</p>
      </div>
    </div>
  )
}
