import { toast, Toaster } from 'sonner'
import { Publication } from './Publication'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchExchanges } from './hooks/fetchExchanges'

export const PublicationList = ({ publications }) => {
  const navigate = useNavigate()
  const [exchanges, setExchanges] = useState([])

  useEffect(() => {
    fetchExchanges(setExchanges, navigate)
  }, [navigate])

  const handleError = (message) => {
    toast.error(message)
  }
  const reversedPublications = [...publications].reverse()
  const sortedPublications = [...reversedPublications].sort((a, b) => {
    if (a.destacada === 'si' && b.destacada !== 'si') return -1
    if (b.destacada === 'si' && a.destacada !== 'si') return 1
    return 0
  })
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="bottom-right" />
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:p-6 lg:grid-cols-4">
        {sortedPublications.map((publication, index) => (
          <Publication key={index} publication={publication} onError={handleError} />
        ))}
      </section>
    </div>
  )
}
