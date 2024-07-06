import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFotosUrls } from '../../utils/fotoUtils'
import getCategory from '../../utils/useConversor'
import { toast, Toaster } from 'sonner'

export const MyPublication = ({ publication, onError }) => {
  const [fotoUrl, setFotoUrl] = useState('') // Estado para la URL de la foto
  const [estado, setEstado] = useState('')
  const [color, setColor] = useState('')
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
  useEffect(() => {
    if (publication.rechazado === 1) {
      setColor('bg-fede-rojo')
      setEstado('Rechazada')
    } else if (publication.precio === 0) {
      setColor('bg-fede-amarillo')
      setEstado('Pendiente de revisión')
    } else {
      setEstado('')
      setColor('bg-white')
    }
  }, [publication])

  return (
    <div
      className={`h-30 relative flex items-center rounded-lg ${color} p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <span onClick={handleClick} className="absolute inset-0 z-10" href="#">
        <span className="sr-only">View</span>
      </span>
      {fotoUrl ? (
        <img
          src={fotoUrl}
          alt={publication.nombre}
          width="24"
          height="24"
          className="mr-4 h-24 w-24 rounded-sm bg-white object-contain"
        />
      ) : (
        // Si no hay una URL de foto, muestra un texto de carga
        <div className="mr-4 flex aspect-square h-24 w-24 items-center justify-center bg-gray-200 object-cover text-lg">
          Cargando...
        </div>
      )}

      <div className="flex h-full flex-1 flex-col justify-between">
        <div className="flex items-center">
          <h3 className="text-xl font-semibold">{publication.nombre}</h3>
          <p className="ml-4 mt-1 text-xs text-gray-500">{publication.estado}</p>
          <span className="ml-auto font-medium text-gray-500">{estado}</span>
        </div>
        <p className="text-sm text-gray-500">{publication.descripcion}</p>
        {publication.precio !== 0 ? (
          <span className="self-end text-base font-medium text-gray-500">
            Categoría: {getCategory(publication.precio)}
          </span>
        ) : null}
      </div>
    </div>
  )
}
