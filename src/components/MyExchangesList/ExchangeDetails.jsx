import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { fetchMainProduct } from '../MySuggestionsList/hooks/fetchMainProduct'
import { fetchProducts } from '../MySuggestionsList/hooks/fetchProducts'
import { fetchFotosUrls } from '../../utils/fotoUtils'
import { decodeToken } from '../../utils/tokenUtils'
import useConversor from '../../utils/useConversor'
export const ExchangeDetails = () => {
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
  const [usuario2, setUsuario2] = useState({})
  const [tokenDNI, setDecodedToken] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        // Obtener el producto principal
        const token = localStorage.getItem('token')
        const decodedToken = await decodeToken(token)
        setDecodedToken(decodedToken.DNI.toString())
        await fetchMainProduct(id, setMainProduct)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (id) init()
  }, [id])

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // Obtener productos ofrecidos
        const fetchedProducts = await fetchProducts(id)
        setOfferedProducts(fetchedProducts)

        // Obtener datos de los usuarios
        const userResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${mainProduct.DNI}`)
        const userResponse2 = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/${fetchedProducts[0].DNI}`
        )
        const userData = await userResponse.json()
        setUsuario(userData[0])
        const userData2 = await userResponse2.json()
        setUsuario2(userData2[0])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (mainProduct.DNI) fetchAdditionalData()
  }, [mainProduct.DNI])

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

  return (
    <>
      <Toaster richColors={true} duration={1500} />
      <div className="flex items-center justify-center">
        <div className="mx-4 my-5 w-full max-w-6xl rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md">
          <div className="grid grid-cols-[2fr_0fr_2fr] gap-2 lg:gap-6">
            <div className="grid items-start gap-4 md:gap-10">
              <div className="items-start md:flex">
                <div className="grid gap-4">
                  <h1 className="text-3xl font-bold">
                    Producto ofrecido por {usuario.nombre} {usuario.apellido}
                  </h1>

                  <div
                    className="duration-300items-center group relative flex  h-full items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 hover:cursor-pointer"
                    onClick={() => navigate(`/ver_publicacion/${mainProduct.idPublicacion}`)}
                  >
                    {mainProductFotoUrl ? (
                      <img
                        src={mainProductFotoUrl}
                        alt="Producto a Intercambiar"
                        width="300"
                        height="300"
                        className="aspect-square overflow-hidden rounded-lg border-gray-200 object-cover"
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
              <div className="grid h-full gap-4">
                <h1 className="text-3xl font-bold">
                  {offeredProducts.length !== 1
                    ? `Productos ofrecidos por ${usuario2.nombre} ${usuario2.apellido}`
                    : `Producto ofrecido por ${usuario2.nombre} ${usuario2.apellido}`}
                </h1>
                {offeredProducts.map((product, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/ver_publicacion/${product.idPublicacion}`)}
                    className={
                      'group relative flex h-full items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:cursor-pointer'
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
              <div className="inline-flex h-9 px-3"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
