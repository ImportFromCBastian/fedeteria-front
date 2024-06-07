import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ProductsExchange } from './ProductsExchange'
import useConversor from '../../utils/useConversor'
import enviarNotificacion from '../Notificaciones/enviarNotificacion'
import { Toaster, toast } from 'sonner'
import { fetchFotosUrls } from '../../utils/fotoUtils'

export const SuggestExchange = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [publication, setPublication] = useState({})
  const [suggestPublications, setSuggestPublications] = useState([])
  const [message, setMessage] = useState('')
  const [selectedPublication, setSelectedPublication] = useState([])
  const [finalPrice, setFinalPrice] = useState(0)
  const [fotoUrl, setFotoUrl] = useState('')
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const [showCategorias, setCategorias] = useState(false)
  const handleMouseEnter = () => {
    setCategorias(true)
  }

  const handleMouseLeave = () => {
    setCategorias(false)
  }
  const fetchToken = async () => {
    const localToken = localStorage.getItem('token')
    if (!localToken) {
      navigate('/')
      return null
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localToken}`
        }
      })
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching token:', error)
      return null
    }
  }

  const fetchPublication = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/publication/${id}`)
      const data = await response.json()
      setPublication(data)
    } catch (error) {
      console.error('Error fetching publication:', error)
    }
  }

  const fetchClientPublications = async (dni) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/publication/user/${dni}`)
      const data = await response.json()
      if (data.length === 0) {
        alert('No tienes publicaciones para intercambiar')
        navigate(`/ver_publicacion/${id}`)
      } else {
        setSuggestPublications(data)
      }
    } catch (error) {
      console.error('Error fetching client publications:', error)
    }
  }

  const fetchSuggestions = async (dni) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/exchange/suggestions/dni/${dni}`
      )
      const data = await response.json()
      const filteredSuggested = data.filter(
        (suggestion) => suggestion.productoDeseado === parseInt(id)
      )
      if (filteredSuggested.length > 0) {
        navigate(`/ver_publicacion/${id}`)
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const fetchFotos = async () => {
    try {
      const urls = await fetchFotosUrls(id)
      if (urls.length > 0) {
        setFotoUrl(urls[0])
      }
    } catch (error) {
      console.error('Error fetching photos:', error)
    }
  }

  useEffect(() => {
    const init = async () => {
      await fetchPublication()
      const token = await fetchToken()
      if (token) {
        await fetchClientPublications(token.DNI)
        await fetchSuggestions(token.DNI)
      }
      await fetchFotos()
    }
    init()
  }, [id])

  const handleCancel = () => {
    navigate('/ver_publicacion/' + publication.idPublicacion)
  }

  const childHandleClick = (index, action) => {
    const selected = suggestPublications[index]
    if (action === 'remove') {
      setFinalPrice(finalPrice - selected.precio)
      const newSelected = selectedPublication.filter((id) => id !== selected.idPublicacion)
      setSelectedPublication(newSelected)
    } else if (action === 'add') {
      setFinalPrice(finalPrice + selected.precio)
      setSelectedPublication([...selectedPublication, selected.idPublicacion])
    }
  }

  const handleExchange = async () => {
    const finalPriceCategory = useConversor(finalPrice)
    const publicationCategory = useConversor(publication.precio)

    if (finalPriceCategory !== publicationCategory) {
      toast.error('La diferencia de categorias entre las publicaciones es demasiado alta')
      return
    }

    setMessage('realizando sugerencia')
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mainPublication: publication.idPublicacion,
          publicationList: selectedPublication
        })
      })
      const result = await response.json()
      if (!result.ok) throw new Error('Error al realizar la sugerencia de intercambio')

      enviarNotificacion(
        'intercambio',
        `Tienes una sugerencia de trueque nueva en ${publication.nombre}`,
        publication.DNI
      )
      toast.success('Sugerencia realizada con exito')
      await delay(2000)
      navigate('/ver_publicacion/' + publication.idPublicacion)
    } catch (error) {
      console.error('Error during exchange:', error)
      toast.error('Error al realizar la sugerencia de intercambio')
    }
  }

  return (
    <>
      {suggestPublications.length === 0 ? (
        <h1>No hay publicaciones</h1>
      ) : (
        <>
          <Toaster expand="true" richColors="true" />
          <div className="flex items-center justify-center">
            <div className="mx-4 my-5 w-full max-w-6xl rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md">
              <div className="grid grid-cols-[2fr_1fr_2fr] gap-6 lg:gap-12">
                <div className="grid items-start gap-4 md:gap-10">
                  <div className="items-start md:flex">
                    <div className="grid gap-4">
                      <h1 className="text-3xl font-bold">Producto a Intercambiar</h1>
                      <div className="flex items-center gap-4">
                        {fotoUrl ? (
                          <img
                            src={fotoUrl}
                            alt="Producto a Intercambiar"
                            width="300"
                            height="300"
                            className="aspect-square overflow-hidden rounded-lg border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="mr-4 flex aspect-square h-72 w-72 items-center justify-center rounded-lg bg-gray-200 text-xs">
                            Cargando...
                          </div>
                        )}
                        <div className="grid gap-2">
                          <h3 className="text-xl font-semibold">{publication.nombre}</h3>
                          <p className="text-sm text-gray-500">{publication.descripcion}</p>
                          <h3 className="text-x">Categoria: {useConversor(publication.precio)}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-gray-500"
                  >
                    <path d="M8 3L4 7l4 4"></path>
                    <path d="M4 7h16"></path>
                    <path d="m16 21 4-4-4-4"></path>
                    <path d="M20 17H4"></path>
                  </svg>
                </div>
                <div className="grid gap-4">
                  <h2 className="text-2xl font-bold">Productos a Ofrecer</h2>
                  <div className="grid gap-4">
                    {suggestPublications.map((publication, index) => (
                      <ProductsExchange
                        key={index}
                        onChildChange={childHandleClick}
                        publication={publication}
                        index={index}
                      />
                    ))}
                  </div>
                  <hr className="flex-1 border-gray-200" />
                  <span className="text-3xl font-bold">
                    {showCategorias && (
                      <div className="z-5 absolute -right-0 bottom-80 mb-2 w-64 -translate-x-1/2 transform rounded-xl bg-fede-main/40 p-4 shadow-lg backdrop-blur-md">
                        <h3 className="text-base font-medium text-fede-texto-input">
                          Conversión de categorías
                        </h3>
                        <ul className="mt-2 text-sm text-fede-texto-input/50">
                          <li> I $1-1000</li>
                          <li> II $1000-2500</li>
                          <li> III $2500-5000</li>
                          <li> IV $5000-7500</li>
                          <li> V $7500-10000</li>
                          <li> VI $10000-20000</li>
                          <li> VII $20000-40000</li>
                          <li> VIII $40000-70000</li>
                          <li> IX $70000-100000</li>
                          <li> X $100000</li>
                        </ul>
                      </div>
                    )}
                    <span
                      className="material-symbols-outlined float-right cursor-pointer rounded-full outline-dotted"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      question_mark
                    </span>
                    Categoria Final:{' '}
                    {useConversor(finalPrice) === '0' ? '-' : useConversor(finalPrice)}
                  </span>
                  <button
                    onClick={handleExchange}
                    className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-green-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    // disabled={message !== ''}
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
