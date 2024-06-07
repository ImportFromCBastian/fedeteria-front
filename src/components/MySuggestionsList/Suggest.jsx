import { fetchFotosUrls } from '../../utils/fotoUtils'
import { publicationInfo } from './hooks/publicationInfo'
import { useEffect, useState } from 'react'

export const Suggest = ({ mainPublicationID, publicationCount }) => {
  const [fotoUrl, setFotoUrl] = useState('')
  const [publication, setPublication] = useState({})

  const fetchFotos = async () => {
    try {
      const urls = await fetchFotosUrls(mainPublicationID)
      if (urls.length > 0) {
        setFotoUrl(urls[0])
      }
    } catch (error) {
      console.error('Error fetching photos:', error)
    }
  }

  useEffect(() => {
    fetchFotos(mainPublicationID)
    publicationInfo(mainPublicationID, setPublication)
  }, [])

  return (
    <div className="grid grid-cols-[2fr_1fr_2fr] gap-6 rounded-lg border bg-white p-10 lg:gap-12">
      <div>
        <h2 className="text-2xl font-bold">{publication.nombre}</h2>
        <img
          src={fotoUrl}
          alt="Producto a Intercambiar"
          className=" aspect-square  overflow-hidden rounded-lg border border-gray-200 object-cover"
        />
      </div>
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
      <h1>{publicationCount} productos a cambio...</h1>
    </div>
  )
}
