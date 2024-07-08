import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header } from './Header'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { ExchangeChikito } from '../publicaciones/ExchangeChikito.jsx'
import { fetchExchanges } from '../publicaciones/hooks/fetchExchanges'

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

const Layout = () => {
  const [exchanges, setExchanges] = useState([])

  useEffect(() => {
    fetchExchanges(setExchanges)
  }, [])

  return (
    <>
      <Header />
      <div style={backgroundStyle}>
        <div style={overlayStyle}>
          <Outlet />
          <div className="h-20" />
          {exchanges.length >= 5 && (
            <div className=" fixed bottom-0 left-0 right-0 -mb-4 ">
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
    </>
  )
}

const backgroundStyle = {
  minHeight: '100vh',
  backgroundImage: "url('/public/big fondo.png')", // Asegúrate de usar la URL correcta
  backgroundSize: 'auto',
  backgroundRepeat: 'repeat-y',
  backgroundPosition: 'center top'
}

const overlayStyle = {
  minHeight: '100vh',
  backgroundColor: 'rgba(255, 237, 213, 0.9)' // Fondo naranja con opacidad del 90%
}

export default Layout
