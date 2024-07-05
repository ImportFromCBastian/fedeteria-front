import { toast, Toaster } from 'sonner'
import { Publication } from './Publication'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExchangeChikito } from './ExchangeChikito'
import { fetchExchanges } from './hooks/fetchExchanges'

export const PublicationList = ({ publications }) => {
  const navigate = useNavigate()
  const [exchanges, setExchanges] = useState([])

  useEffect(() => {
    fetchExchanges(setExchanges, navigate)
  }, [navigate])

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
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
      <section className="grid flex-grow grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:p-6 lg:grid-cols-4">
        {publications.map((publication, index) => (
          <Publication key={index} publication={publication} onError={handleError} />
        ))}
      </section>

      <div className="sticky -bottom-2 w-full bg-white">
        {exchanges.length >= 5 && (
          <div className="sticky -bottom-2 w-full bg-white">
            <Carousel
              swipeable={false}
              draggable={false}
              showDots={false}
              responsive={responsive}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000} // 3 segundos entre movimientos
              keyBoardControl={false}
              customTransition="transform 4s linear" // 3 segundos de duración de la transición
              transitionDuration={4000} // 3 segundos de duración de la transición
              containerClass="carousel-container h-24"
              removeArrowOnDeviceType={['desktop']}
              deviceType={'desktop'}
              itemClass="carousel-item-padding-0-px h-24"
              rewind={false}
            >
              {exchanges.map((exchange, index) => (
                <ExchangeChikito
                  key={index}
                  mainPublicationID={exchange.productoDeseado}
                  publicationCount={exchange.countPublication}
                  exchangeID={exchange.idTrueque}
                />
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  )
}
