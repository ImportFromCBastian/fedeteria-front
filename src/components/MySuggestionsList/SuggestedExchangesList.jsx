import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSuggestions } from './hooks/fetchSuggestions'
import { Suggest } from './Suggest'
import { SentSuggest } from './SentSuggest'

export const SuggestedExchangesList = () => {
  const navigate = useNavigate()
  const [receivedSuggestions, setReceivedSuggestions] = useState([])
  const [givenSuggestions, setGivenSuggestions] = useState([])
  const [showReceived, setShowReceived] = useState(true)

  useEffect(() => {
    fetchSuggestions(setReceivedSuggestions, setGivenSuggestions, navigate)
  }, [navigate])
  const toggleShowReceived = () => {
    setShowReceived(true)
  }

  const toggleShowGiven = () => {
    setShowReceived(false)
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Listado de tus sugerencias
        </h2>
        <div className="flex">
          <button
            onClick={toggleShowReceived}
            className={`mr-4 rounded-full px-4 py-2 ${showReceived ? 'bg-fede-main text-white' : 'bg-gray-300 text-gray-700'} w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105  focus:outline-none  `}
          >
            Recibidas
          </button>
          <button
            onClick={toggleShowGiven}
            className={`rounded-full px-4 py-2 ${!showReceived ? 'bg-fede-main text-white' : 'bg-gray-300 text-gray-700'} w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105  focus:outline-none `}
          >
            Enviadas
          </button>
        </div>
      </div>
      <p className="pt-2 text-gray-500 md:text-xl/relaxed">
        Acá podés ver tus propuestas de trueque
      </p>
      <div className="space-y-4 py-1 ">
        {showReceived ? (
          <>
            <h3 className="text-2xl font-bold">Sugerencias recibidas</h3>
            {receivedSuggestions.length === 0 ? (
              <p>Todavía no tienes sugerencias de trueque recibidas!</p>
            ) : (
              receivedSuggestions.map((suggestion, index) => (
                <Suggest
                  key={index}
                  mainPublicationID={suggestion.productoDeseado}
                  publicationCount={suggestion.countPublication}
                  exchangeID={suggestion.idTrueque}
                />
              ))
            )}
          </>
        ) : (
          <>
            <h3 className="text-2xl font-bold">Sugerencias enviadas</h3>
            {givenSuggestions.length === 0 ? (
              <p>No has enviado sugerencias de trueque!</p>
            ) : (
              givenSuggestions.map((suggestion, index) => (
                <SentSuggest
                  key={index}
                  mainPublicationID={suggestion.productoDeseado}
                  publicationCount={suggestion.countPublication}
                  exchangeID={suggestion.idTrueque}
                />
              ))
            )}
          </>
        )}
      </div>
    </section>
  )
}
