import { fetchFotosUrls } from '../../utils/fotoUtils'
import { publicationInfo } from './hooks/publicationInfo'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchProducts } from './hooks/fetchProducts'
export const Suggest = ({ mainPublicationID, publicationCount, exchangeID }) => {
  const navigate = useNavigate()
  const [fotoUrl, setFotoUrl] = useState('')
  const [publication, setPublication] = useState({})
  const [offeredPublication, setOfferedPublication] = useState({})
  const [offeredFotoUrl, setOfferedFotoUrl] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the main publication data
        const urls = await fetchFotosUrls(mainPublicationID)
        if (urls.length > 0) {
          setFotoUrl(urls[0])
        }
        const pubInfo = await publicationInfo(mainPublicationID)
        setPublication(pubInfo)

        if (publicationCount === 1) {
          const offeredPubInfo = await fetchProducts(exchangeID)
          if (offeredPubInfo.length > 0) {
            setOfferedPublication(offeredPubInfo[0])
            const offeredUrls = await fetchFotosUrls(offeredPubInfo[0].idPublicacion)
            if (offeredUrls.length > 0) {
              setOfferedFotoUrl(offeredUrls[0])
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [mainPublicationID, exchangeID, publicationCount])

  const handleClick = () => {
    navigate(`/ver_sugerencia/${exchangeID}`)
  }

  return (
    <div
      onClick={handleClick}
      className=" relative rounded-lg border bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-xl"
    >
      {/* Siempre se muestra la imagen y el nombre del producto principal */}
      <div className="flex items-center">
        <img
          src={fotoUrl || '/placeholder-image.jpg'}
          alt={publication.nombre || 'Cargando...'}
          className="h-24 w-24 rounded-xl bg-white object-fill"
        />
        <h3 className="mb-2 ml-4 text-lg font-medium">
          {publication.nombre || 'Nombre del Producto'}
        </h3>
      </div>

      {/* Ícono de intercambio y cantidad de productos ofrecidos */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-gray-500"
          >
            <path d="M8 3L4 7l4 4"></path>
            <path d="M4 7h16"></path>
            <path d="m16 21 4-4-4-4"></path>
            <path d="M20 17H4"></path>
          </svg>
        </div>

        <div className="absolute right-4 flex items-center">
          {/* Se muestra la imagen del producto ofrecido solo si hay uno */}
          {publicationCount === 1 ? (
            <div className="flex items-center justify-center">
              <h3 className="mb-2 ml-4 text-lg font-medium">
                {offeredPublication.nombre || 'Nombre del Producto'}
              </h3>
              <img
                src={offeredFotoUrl || '/placeholder-image.jpg'}
                alt={offeredPublication.nombre || 'Cargando...'}
                className="ml-2 h-24 w-24 rounded-xl bg-white object-fill"
              />
            </div>
          ) : (
            <h3 className="mb-2 ml-4 text-lg font-medium">
              {publicationCount} productos a cambio...
            </h3>
          )}
        </div>
      </div>
    </div>
  )
}
