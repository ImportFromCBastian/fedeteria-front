import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFotosUrls } from '../../utils/fotoUtils'
import { publicationInfo } from '../MySuggestionsList/hooks/publicationInfo'
import { fetchExchangeProductsByID } from './fetchExchangeProductsByID'
import { getExchangeInfoById } from './fetchExchangeInfo'
import { getState } from '../../utils/useConversorState'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const Exchange = ({ mainPublicationID, publicationCount, exchangeID, state }) => {
  const navigate = useNavigate()
  const [fotoUrl, setFotoUrl] = useState('')
  const [publication, setPublication] = useState({})
  const [offeredPublication, setOfferedPublication] = useState({})
  const [offeredFotoUrl, setOfferedFotoUrl] = useState('')
  const [color, setColor] = useState('')

  const [trueque, setTrueque] = useState({
    idTrueque: 0,
    hora: 0,
    fecha: 0,
    realizado: 0,
    productoDeseado: 0,
    idLocal: 0
  })

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token === null) {
          navigate('/')
          return
        }
        const decodedToken = await decodeToken(token)
        if (decodedToken.rol !== 'empleado' && decodedToken.rol !== 'administrador') {
          navigate('/unauthorized')
          return
        }
        // Fetch the main publication data
        const urls = await fetchFotosUrls(mainPublicationID)
        if (urls.length > 0) {
          setFotoUrl(urls[0])
        }
        const pubInfo = await publicationInfo(mainPublicationID)
        setPublication(pubInfo)

        // Fetch the offered publication data if there is only one offered publication
        if (publicationCount === 1) {
          const offeredPubInfo = await fetchExchangeProductsByID(exchangeID)
          if (offeredPubInfo.length > 0) {
            setOfferedPublication(offeredPubInfo[0])
            const offeredUrls = await fetchFotosUrls(offeredPubInfo[0].idPublicacion)
            if (offeredUrls.length > 0) {
              setOfferedFotoUrl(offeredUrls[0])
            }
          }
        }

        // Fetch exchange information
        const exchangeInfo = await getExchangeInfoById(exchangeID)
        setTrueque(exchangeInfo)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [mainPublicationID, exchangeID, publicationCount])

  const handleClick = () => {
    navigate(`/ver_intercambio/${exchangeID}`)
  }

  useEffect(() => {
    switch (state) {
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
  }, [state])

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-lg border p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl ${color}`}
      style={{ minWidth: '320px' }} // Ajusta el ancho mínimo según tus necesidades
    >
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

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Contenedor para ícono de intercambio */}
        <div className="relative flex items-center justify-center">
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
            className="absolute h-8 w-8 text-gray-500"
            style={{ top: '50%', transform: 'translateY(-50%)' }} // Centra verticalmente
          >
            <path d="M8 3L4 7l4 4"></path>
            <path d="M4 7h16"></path>
            <path d="m16 21 4-4-4-4"></path>
            <path d="M20 17H4"></path>
          </svg>
        </div>

        {/* Contenedor para el estado */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
          {getState(state)}
        </div>

        <div className="absolute right-0 flex items-center">
          {/* Contenido a la derecha de la imagen del producto ofrecido */}
          {publicationCount === 1 ? (
            <div className="ml-4 flex items-center">
              <h3 className="mr-2 text-lg font-medium">
                {offeredPublication.nombre || 'Nombre del Producto'}
              </h3>
              <img
                src={offeredFotoUrl || '/placeholder-image.jpg'}
                alt={offeredPublication.nombre || 'Cargando...'}
                className="h-24 w-24 rounded-xl bg-white object-fill"
              />
            </div>
          ) : (
            <h3 className="mb-2 ml-4 text-lg font-medium">
              {publicationCount} productos a cambio...
            </h3>
          )}

          {/* Texto con la hora y fecha del trueque */}
          {state === 3 && trueque.hora && (
            <p className="ml-2 text-xs font-semibold text-black">
              se realizará
              <br />
              {format(new Date(trueque.fecha), "d 'de' MMMM", { locale: es })}
              <br />a las {String(trueque.hora).slice(0, 5)}{' '}
            </p>
          )}
          {state !== 3 && (
            <p className="ml-2 text-xs font-semibold text-black">&nbsp;&nbsp;&nbsp;&nbsp;</p>
          )}
        </div>
      </div>
    </div>
  )
}
export { Exchange }
