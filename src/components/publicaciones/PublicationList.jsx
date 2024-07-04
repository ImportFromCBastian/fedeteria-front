import { toast, Toaster } from 'sonner'
import { Publication } from './Publication'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExchangeChikito } from './ExchangeChikito'
import { fetchExchanges } from '../MyExchangesList/hooks/fetchExchanges'

export const PublicationList = ({ publications }) => {
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

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  }

  const handleError = (message) => {
    toast.error(message)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="bottom-right" />
      <section className="grid flex-grow grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 md:p-6 lg:grid-cols-4">
        {publications.map((publication, index) => (
          <Publication key={index} publication={publication} onError={handleError} />
        ))}
      </section>
      <div className="sticky bottom-0 w-full bg-white">
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={0}
          keyBoardControl={true}
          customTransition="transform 10s linear"
          transitionDuration={10000}
          containerClass="carousel-container h-24"
          removeArrowOnDeviceType={['desktop']}
          deviceType={'desktop'}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px h-24"
        >
          {exchanges.length === 0 ? (
            <p>No tenés trueques activos!</p>
          ) : (
            exchanges.map((exchange, index) => (
              <ExchangeChikito
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
        </Carousel>
      </div>
    </div>
  )
}
