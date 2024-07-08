import { fetchFotosUrls } from '../../utils/fotoUtils'
import { publicationInfo } from '../MySuggestionsList/hooks/publicationInfo'
import { useEffect, useState } from 'react'
import { fetchExchangeProduct } from '../MyExchangesList/hooks/fetchExchangeProduct'

export const ExchangeChikito = ({ mainPublicationID, publicationCount, exchangeID }) => {
  const [fotoUrl, setFotoUrl] = useState('')
  const [publication, setPublication] = useState(null)
  const [offeredPublication, setOfferedPublication] = useState(null)
  const [offeredFotoUrl, setOfferedFotoUrl] = useState('')

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

  return (
    <div className="ml-2 flex rounded-md border-2 border-fede-main bg-white transition-transform duration-300 hover:shadow-xl">
      <div className="relative flex-grow rounded-lg p-4">
        <div className="flex items-center">
          <img
            src={fotoUrl || '/placeholder-image.jpg'}
            alt={publication?.nombre || 'Cargando...'}
            className="h-10 w-10 rounded-xl bg-white object-fill"
          />
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
              className="h-4 w-4 text-gray-500"
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
                <img
                  src={offeredFotoUrl || '/placeholder-image.jpg'}
                  alt={offeredPublication?.nombre || 'Cargando...'}
                  className="ml-2 h-12 w-12 rounded-xl bg-white object-fill"
                />
              </div>
            ) : (
              <h3 className="mb-2 ml-4 overflow-hidden text-ellipsis whitespace-normal break-words text-xs font-medium">
                {publicationCount} productos <br /> a cambio...
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
