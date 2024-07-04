import { useEffect, useState } from 'react'
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
  const [filter, setFilter] = useState('all')
  const [showGuiaColores, setShowGuiaColores] = useState(false)

  useEffect(() => {
    fetchExchanges(setExchanges, navigate)
  }, [navigate])

  const openModal = (exchangeID, nombrePublicacion, publicationCount, nombreOfrecida) => {
    setSelectedExchangeID(exchangeID)
    setIsModalOpen(true)
    setNombrePublicacion(nombrePublicacion)
    setPublicationCount(publicationCount)
    setNombreOfrecida(nombreOfrecida)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const filteredExchanges = exchanges.filter((exchange) => {
    if (filter === 'all') return true
    return exchange.realizado === parseInt(filter)
  })

  const handleMouseEnter = () => {
    setShowGuiaColores(true)
  }

  const handleMouseLeave = () => {
    setShowGuiaColores(false)
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <div className="relative flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Listado de tus intercambios
        </h2>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="ml-4 mt-4 rounded-lg border border-fede-main p-2 hover:bg-gray-200"
        >
          <option value="all">Todos</option>
          <option value="0">No realizado</option>
          <option value="1">Realizado</option>
          <option value="2">Pendiente de horario</option>
          <option value="3">Por realizarse</option>
        </select>
        <div className="relative">
          <span
            className=" material-symbols-outlined float-right mt-4 cursor-pointer rounded-full outline-dotted"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            question_mark
          </span>
          {showGuiaColores && (
            <div className="absolute -right-52 z-50 mt-4 w-48 rounded-xl bg-fede-main/40 p-4 backdrop-blur-md">
              <h3 className="text-base font-medium text-fede-texto-input">Guía de colores</h3>
              <ul className="mt-2 text-sm text-fede-texto-input/50">
                <li>- Verde - realizado</li>
                <li>- Rojo - no realizado</li>
                <li>- Azul - pendiente de selección de horario</li>
                <li>- Amarillo - por realizarse</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl">
        Estos son todos los trueques en los que formaste parte
      </p>
      <div className="space-y-4 py-1 pl-6">
        {filteredExchanges.length === 0 ? (
          <p>Aún no tenés trueques, ¿Qué esperás para empezar a intercambiar?</p>
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
