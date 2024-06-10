import { useEffect, useState } from 'react'
import { publicationInfo } from './hooks/publicationInfo'

export const SuggestAccept = ({ mainPublicationID, publicationCount, exchangeID }) => {
  const [publication, setPublication] = useState({})

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const data = await publicationInfo(mainPublicationID)
        setPublication(data)
      } catch (error) {
        console.error('Error fetching publication info:', error)
      }
    }

    fetchPublication()
  }, [mainPublicationID])

  return (
    <option value={exchangeID}>
      {publication.nombre} - tiene {publicationCount} artículos a cambio
    </option>
  )
}
