import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { fetchMainProduct } from './hooks/fetchMainProduct'
import { fetchProducts } from './hooks/fetchProducts'
import { ProductSuggested } from './ProductSuggested'
import { createPendingExchange } from './hooks/createPendingExchange'
import { deleteSuggestions } from './hooks/deleteSuggestions'
import { sendContactEmail } from './hooks/sendContactEmail'
import { fetchFotosUrls } from '../../utils/fotoUtils'
import useConversor from '../../utils/useConversor'

export const SuggestDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams('')
  const [mainProduct, setMainProduct] = useState({
    idPublicacion: '',
    DNI: '',
    nombre: '',
    estado: '',
    precio: 0
  })
  const [offeredProducts, setOfferedProducts] = useState([])
  const [mainProductFotoUrl, setMainProductFotoUrl] = useState('')
  const [offeredProductsFotos, setOfferedProductsFotos] = useState([])
  const [usuario, setUsuario] = useState({})

  useEffect(() => {
    const init = async () => {
      await fetchMainProduct(id, setMainProduct)
      const fetchedProducts = await fetchProducts(id)
      setOfferedProducts(fetchedProducts)
      const userResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/${fetchedProducts[0].DNI}`
      )
      const userData = await userResponse.json()
      setUsuario(userData[0])
    }
    init()
  }, [id])

  useEffect(() => {
    const fetchProductFotos = async () => {
      try {
        if (mainProduct.idPublicacion) {
          const urls = await fetchFotosUrls(mainProduct.idPublicacion)
          if (urls.length > 0) {
            setMainProductFotoUrl(urls[0])
          }
        }
      } catch (error) {
        console.error('Error fetching photos:', error)
      }
    }

    fetchProductFotos()
  }, [mainProduct.idPublicacion])

  useEffect(() => {
    const fetchOfferedProductsFotos = async () => {
      try {
        const urlsPromises = offeredProducts.map(async (product) => {
          const urls = await fetchFotosUrls(product.idPublicacion)
          return urls.length > 0 ? urls[0] : ''
        })
        const urls = await Promise.all(urlsPromises)
        setOfferedProductsFotos(urls)
      } catch (error) {
        console.error('Error fetching offered products photos:', error)
      }
    }

    fetchOfferedProductsFotos()
  }, [offeredProducts])

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleAcceptExchange = async (e) => {
    e.preventDefault()
    const resultPending = await createPendingExchange(id)
    if (!resultPending.ok) return toast.error('Error al aceptar el trueque')

    const resultDeletion = await deleteSuggestions(mainProduct.idPublicacion)
    if (!resultDeletion.ok) return toast.error('Error al eliminar las sugerencias')

    const sendMail = await sendContactEmail(mainProduct.DNI, offeredProducts[0].DNI)
    if (!sendMail.ok) return toast.error('Error al enviar el correo')

    toast.success('Trueque aceptado')
    await delay(2500)
    navigate('/')
  }

  return (
    <>
      <Toaster richColors={true} duration={1500} />
      <div className="flex items-center justify-center">
        <div className="mx-4 my-5 w-full max-w-6xl rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md">
          <div className="grid grid-cols-[2fr_0fr_2fr] gap-2 lg:gap-6">
            <div className="grid items-start gap-4 md:gap-10">
              <div className="items-start md:flex">
                <div className="grid gap-4">
                  <h1 className=" text-3xl font-bold">Tu producto</h1>
                  <div className="flex items-center gap-4">
                    {mainProductFotoUrl ? (
                      <img
                        src={mainProductFotoUrl}
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
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">{mainProduct.nombre}</h3>
                      <p className="text-sm text-gray-500">{mainProduct.descripcion}</p>
                      <p className="text-sm text-gray-500">
                        Categoria: {useConversor(mainProduct.precio)}
                      </p>
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
              <h1 className="text-3xl font-bold">
                Productos ofrecidos por {usuario.nombre} {usuario.apellido}
              </h1>
              <div className="grid h-full gap-4">
                {offeredProducts.map((product, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/ver_publicacion/${product.idPublicacion}`)}
                    className={
                      'group relative flex h-full items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 '
                    }
                  >
                    {offeredProductsFotos[index] ? (
                      <img
                        src={offeredProductsFotos[index]}
                        alt={`Producto ${product.nombre}`}
                        width="100"
                        height="100"
                        className="aspect-square overflow-hidden rounded-lg object-cover "
                      />
                    ) : (
                      <div className="mr-4 flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200 text-xs">
                        Cargando...
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-bold">{product.nombre}</h3>
                      <p className="text-sm text-gray-500">{product.descripcion}</p>
                      <p className="text-sm text-gray-500">
                        Categoria: {useConversor(product.precio)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAcceptExchange}
                className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-green-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Aceptar Trueque
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
