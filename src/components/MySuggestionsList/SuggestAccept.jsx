import { useEffect, useState } from 'react'
import { publicationInfo } from './hooks/publicationInfo'

export const SuggestAccept = ({ mainPublicationID, publicationCount, exchangeID }) => {
  const [publication, setPublication] = useState({})

  useEffect(() => {
    publicationInfo(mainPublicationID, setPublication)
  }, [mainPublicationID])

  return (
    <option value={exchangeID}>
      {publication.nombre} - tiene {publicationCount} sugerencias
    </option>
  )
}
