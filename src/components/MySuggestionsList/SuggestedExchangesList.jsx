import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSuggestions } from './hooks/fetchSuggestions'
import { Suggest } from './Suggest'

export const SuggestedExchangesList = () => {
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    fetchSuggestions(setSuggestions, navigate)
  }, [])

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <h2 className="pl-6 pt-4 text-3xl font-bold tracking-tighter md:text-4xl">
        Listado de tus sugerencias
      </h2>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed ">
        Acá podés ver las las propuestas de trueque de tus publicaciones.
      </p>
      <div className="space-y-4 py-1 pl-6">
        {suggestions.length === 0 ? (
          <p>Todavía no tenés sugerencias de trueque!</p>
        ) : (
          suggestions.map((suggestion, index) => (
            <Suggest
              key={index}
              mainPublicationID={suggestion.productoDeseado}
              publicationCount={suggestion.countPublication}
              exchangeID={suggestion.idTrueque}
            />
          ))
        )}
      </div>
    </section>
  )
}
