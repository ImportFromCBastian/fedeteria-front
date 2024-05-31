import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ProductsExchange } from './ProductsExchange'
import useConversor from '../../utils/useConversor'
import { Toaster, toast } from 'sonner'

export const SuggestExchange = () => {
  const { id } = useParams('')
  const navigate = useNavigate()
  const [publication, setPublication] = useState({})
  const [suggestPublications, setSuggestPublications] = useState([])
  const [message, setMessage] = useState('')
  const [selectedPublication, setSelectedPublication] = useState([])
  const [finalPrice, setFinalPrice] = useState(0)

  const fetchData = async () => {
    const result = await gatherToken()
    const suggested = await fetchSuggestion(result)

    const filteredSuggested = suggested.filter((suggestion) => {
      return suggestion.productoDeseado === parseInt(id)
    })
    if (filteredSuggested.length > 0) {
      return navigate(`/ver_publicacion/${id}`)
    }
  }

  const fetchSuggestion = async (token) => {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/suggestions/dni/${token.DNI}`)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => new Error(err))
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  //0. gather primary publication
  const fetchPublication = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/publication/${id}`)
      .then((res) => res.json())
      .then((data) => setPublication(data))
      .catch((err) => new Error(err))
  }

  //1. gather client publications
  const gatherToken = async () => {
    const localToken = localStorage.getItem('token')
    if (localToken === null) {
      navigate('/')
      return
    }
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
      headers: {
        Authorization: `Bearer ${localToken}`
      },
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => data.data)
      .catch((e) => new Error(e))
  }
  const fetchClientPublication = async () => {
    const token = await gatherToken()
    const suggest = await fetch(`${import.meta.env.VITE_BASE_URL}/publication/user/${token.DNI}`)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => new Error(err))

    if (suggest.length === 0) {
      alert('No tienes publicaciones para intercambiar')
      return navigate(`/ver_publicacion/${id}`)
    }
    setSuggestPublications(suggest)
    if (publication.DNI === token.DNI)
      return navigate(`/ver_publicacion/${publication.idPublicacion}`)
  }

  useEffect(() => {
    fetchData()
    fetchPublication()
    fetchClientPublication()
  }, [])

  const handleCancel = () => {
    navigate('/ver_publicacion/' + publication.idPublicacion)
    return
  }
  const childHandleClick = (index, action) => {
    if (action === 'remove') {
      setFinalPrice(finalPrice - suggestPublications[index].precio)
      setSelectedPublication(
        selectedPublication.filter(
          (publication) => publication.idPublicacion !== suggestPublications[index].idPublicacion
        )
      )
    }
    if (action === 'add') {
      setFinalPrice(finalPrice + suggestPublications[index].precio)
      selectedPublication.push(suggestPublications[index].idPublicacion)
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
    const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mainPublication: publication.idPublicacion,
        publicationList: selectedPublication
      })
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
    if (!result.ok) return toast.error('Error al realizar la sugerencia de intercambio')
    toast.success('Sugerencia realizada con exito')
    await delay(2000)
    navigate('/ver_publicacion/' + publication.idPublicacion)
  }

  return (
    <>
      {suggestPublications.length === 0 ? (
        <h1>no hay pubs</h1>
      ) : (
        <>
          <Toaster expand="true" richColors="true" />
          <div className="grid grid-cols-[2fr_1fr_2fr]  gap-6 border bg-white p-10  lg:gap-12">
            <div className=" grid items-start gap-4  md:gap-10">
              <div className="items-start md:flex">
                <div className="grid gap-4">
                  <h1 className="text-3xl font-bold">Producto a Intercambiar</h1>
                  <div className="flex items-center gap-4">
                    <img
                      src="/Fedeteria_Solo_Logo.svg"
                      alt="Producto a Intercambiar"
                      width="300"
                      height="300"
                      className="aspect-square overflow-hidden rounded-lg border border-gray-200 object-cover "
                    />
                    <div className="grid gap-2">
                      <h3 className="text-xl font-semibold">{publication.nombre}</h3>
                      <p className="text-sm text-gray-500 ">{publication.descripcion}</p>
                      <h3 className="text-x ">Categoria: {useConversor(publication.precio)}</h3>
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
                className="h-8 w-8 text-gray-500 "
              >
                <path d="M8 3 4 7l4 4"></path>
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
              <hr className="flex-1  border-gray-200 " />
              {/* cambiar final price por catgoria handle (useConversion(finalPrice)) */}
              <span className="text-3xl font-bold">
                Categoria Final: {useConversor(finalPrice)}
              </span>
              <button
                onClick={handleExchange}
                className=" ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md border bg-fede-main-claro px-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                disabled={message !== ''}
              >
                Confirmar
              </button>
              <button
                onClick={handleCancel}
                className=" ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md border px-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
