import { fetchFotosUrls } from '../../utils/fotoUtils'
import { publicationInfo } from '../MySuggestionsList/hooks/publicationInfo'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchExchangeProduct } from './hooks/fetchExchangeProduct'
export const Exchange = ({
  mainPublicationID,
  publicationCount,
  exchangeID,
  realizado,
  fecha,
  hora,
  rol,
  openModal
}) => {
  const [formattedFecha, setFormattedFecha] = useState('')
  const [formattedHora, setFormattedHora] = useState('')
  const navigate = useNavigate()
  const [fotoUrl, setFotoUrl] = useState('')
  const [publication, setPublication] = useState(null)
  const [offeredPublication, setOfferedPublication] = useState(null)
  const [offeredFotoUrl, setOfferedFotoUrl] = useState('')
  const [color, setColor] = useState('')
  useEffect(() => {
    if (fecha) {
      const fechaObj = new Date(fecha)
      const optionsFecha = { day: 'numeric', month: 'long', year: 'numeric' }
      const truncatedHora = hora.slice(0, -3)
      setFormattedHora(truncatedHora)
      setFormattedFecha(fechaObj.toLocaleDateString('es-ES', optionsFecha))
    }
  }, [fecha])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [urls, pubInfo] = await Promise.all([
          fetchFotosUrls(mainPublicationID),
          publicationInfo(mainPublicationID)
        ])

        if (urls.length > 0) setFotoUrl(urls[0])
        setPublication(pubInfo)

        if (publicationCount === 1) {
          const offeredPubInfo = await fetchExchangeProduct(exchangeID)
          if (offeredPubInfo.length > 0) {
            setOfferedPublication(offeredPubInfo[0])
            const offeredUrls = await fetchFotosUrls(offeredPubInfo[0].idPublicacion)
            if (offeredUrls.length > 0) setOfferedFotoUrl(offeredUrls[0])
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [mainPublicationID, exchangeID, publicationCount])

  useEffect(() => {
    switch (realizado) {
      case 0:
        setColor('bg-fede-rojo')
        break
      case 1:
        setColor('bg-fede-verde')
        break
      case 2:
        setColor('bg-fede-azul')
        break
      case 3:
        setColor('bg-fede-amarillo')
        break
      default:
        setColor('bg-white')
        break
    }
  }, [realizado])

  const handleClick = () => {
    navigate(`/ver_intercambio/${exchangeID}`)
  }

  const handleElegirHorario = (e) => {
    e.stopPropagation()
    if (publication && (publicationCount !== 1 || (publicationCount === 1 && offeredPublication))) {
      openModal(exchangeID, publication.nombre, publicationCount, offeredPublication?.nombre)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="flex transition-transform duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-xl"
    >
      <div className={`relative rounded-lg ${color} flex-grow p-4`}>
        <div className="flex items-center">
          <img
            src={fotoUrl || '/placeholder-image.jpg'}
            alt={publication?.nombre || 'Cargando...'}
            className="h-24 w-24 rounded-xl bg-white object-fill"
          />
          <h3 className="ml-4 text-lg font-medium">
            {publication?.nombre || 'Nombre del Producto'}
          </h3>
        </div>
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
            {publicationCount === 1 && offeredPublication ? (
              <div className="flex items-center justify-center">
                <h3 className="mb-2 ml-4 text-lg font-medium">
                  {offeredPublication?.nombre || 'Nombre del Producto'}
                </h3>
                <img
                  src={offeredFotoUrl || '/placeholder-image.jpg'}
                  alt={offeredPublication?.nombre || 'Cargando...'}
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
      <div
        className={`relative -ml-3 rounded-lg ${color} flex h-32 w-36 items-center justify-center`}
        onClick={handleClick}
      >
        {(() => {
          switch (realizado) {
            case 0:
              return <h1 className="text-center text-lg font-medium">No realizado</h1>
            case 1:
              return <h1 className="text-center text-lg font-medium">Realizado</h1>
            case 2:
              return (
                <div>
                  {rol === 'desired' ? (
                    <button
                      onClick={handleElegirHorario}
                      className="cursor-pointer text-center text-lg font-medium underline"
                    >
                      Elegir Horario
                    </button>
                  ) : (
                    <h1 className="text-center text-lg font-medium">Pendiente de horario</h1>
                  )}
                </div>
              )
            case 3:
              return (
                <div>
                  <h1 className="text-center text-lg font-medium">Por realizarse el</h1>
                  <h1 className="text-center text-lg font-medium">
                    {formattedFecha}, {formattedHora}hs
                  </h1>
                </div>
              )
            default:
              return null
          }
        })()}
      </div>
    </div>
  )
}
