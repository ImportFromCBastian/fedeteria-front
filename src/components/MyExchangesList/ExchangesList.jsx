import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchExchanges } from './hooks/fetchExchanges'
import { Exchange } from './Exchange'
import { RegisterDetailsModal } from './RegisterDetailsModal'

export const ExchangesList = () => {
  const navigate = useNavigate()
  const [exchanges, setExchanges] = useState([])
  const [selectedExchangeID, setSelectedExchangeID] = useState(null) // Estado para el intercambio seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nombrePublicacion, setNombrePublicacion] = useState('')
  const [publicationCount, setPublicationCount] = useState(0)
  const [nombreOfrecida, setNombreOfrecida] = useState('')

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

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Listado de tus intercambios
        </h2>
      </div>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed">Acá podés ver tus trueques</p>
      <div className="space-y-4 py-1 pl-6">
        <h3 className="text-2xl font-bold">Sugerencias enviadas</h3>
        {exchanges.length === 0 ? (
          <p>No tenés trueques activos!</p>
        ) : (
          exchanges.map((exchange, index) => (
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
