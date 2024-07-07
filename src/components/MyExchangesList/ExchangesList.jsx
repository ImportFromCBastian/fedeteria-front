import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchExchanges } from './hooks/fetchExchanges'
import { Exchange } from './Exchange'
import { RegisterDetailsModal } from './RegisterDetailsModal'

export const ExchangesList = () => {
  const navigate = useNavigate()
  const [exchanges, setExchanges] = useState([])
  const [selectedExchangeID, setSelectedExchangeID] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nombrePublicacion, setNombrePublicacion] = useState('')
  const [publicationCount, setPublicationCount] = useState(0)
  const [nombreOfrecida, setNombreOfrecida] = useState('')
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    fetchExchanges(setExchanges, navigate)
    console.log(exchanges)
  }, [navigate])

  const openModal = (exchangeID, nombrePublicacion, publicationCount, nombreOfrecida) => {
    setSelectedExchangeID(exchangeID)
    setIsModalOpen(true)
    setNombrePublicacion(nombrePublicacion)
    setPublicationCount(publicationCount)
    setNombreOfrecida(nombreOfrecida)
  }

  const handleFilterChange = (estado) => {
    setFilter(estado === filter ? null : estado)
  }

  const filteredExchanges = exchanges.filter((exchange) => {
    if (filter === null) return true
    return exchange.realizado === parseInt(filter)
  })

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <div className="relative flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Listado de tus intercambios
        </h2>
        <div className="relative"></div>
      </div>
      <p className=" pt-2 text-gray-500 md:text-xl">
        Estos son todos los trueques en los que formaste parte
      </p>
      <div>
        <h2 className="md:text-l mb-2 pt-2 text-gray-500">Filtrar por estado:</h2>
        <button
          className={`mb-2 mr-2 rounded-md px-3 py-1 ${
            filter === null ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange(null)}
        >
          Todas
        </button>

        <button
          className={`mb-2 mr-2 rounded-md px-3 py-1 ${
            filter === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange(2)}
        >
          Pendiente de horario
        </button>
        <button
          className={`mb-2 mr-2 rounded-md px-3 py-1 ${
            filter === 3 ? 'bg-fede-amarillo text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange(3)}
        >
          Por realizarse
        </button>
        <button
          className={`mb-2 mr-2 rounded-md px-3 py-1 ${
            filter === 1 ? 'bg-fede-verde text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange(1)}
        >
          Realizado
        </button>
        <button
          className={`mb-2 mr-2 rounded-md px-3 py-1 ${
            filter === 0 ? 'bg-fede-rojo text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleFilterChange(0)}
        >
          No realizado
        </button>
      </div>
      <div className="space-y-4 py-1">
        {filteredExchanges.length === 0 ? (
          <p>No hay nada que mostrar</p>
        ) : (
          filteredExchanges.map((exchange, index) => (
            <Exchange
              key={index}
              mainPublicationID={exchange.productoDeseado}
              publicationCount={exchange.countPublication}
              exchangeID={exchange.idTrueque}
              realizado={exchange.realizado}
              fecha={exchange.fecha}
              hora={exchange.hora}
              rol={exchange.role}
              openModal={openModal}
            />
          ))
        )}
      </div>
      {isModalOpen && (
        <RegisterDetailsModal
          exchangeID={selectedExchangeID}
          nombrePublicacion={nombrePublicacion}
          publicationCount={publicationCount}
          nombreOfrecida={nombreOfrecida}
        />
      )}
    </section>
  )
}
