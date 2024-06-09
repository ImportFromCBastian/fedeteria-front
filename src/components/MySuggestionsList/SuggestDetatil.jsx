import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { fetchMainProduct } from './hooks/fetchMainProduct'
import { fetchProducts } from './hooks/fetchProducts'
import { ProductSuggested } from './ProductSuggested'
import { createPendingExchange } from './hooks/createPendingExchange'
import { deleteSuggestions } from './hooks/deleteSuggestions'
import { sendContactEmail } from './hooks/sendContactEmail'

export const SuggestDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams('')
  const [mainProduct, setMainProduct] = useState({
    idPublicacion: '',
    DNI: '',
    nombre: '',
    estado: ''
  })
  const [offeredProducts, setOfferedProducts] = useState([mainProduct])

  useEffect(() => {
    fetchMainProduct(id, setMainProduct)
    fetchProducts(id, setOfferedProducts)
  }, [])

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
          <div className="grid grid-cols-[2fr_1fr_2fr] gap-6 lg:gap-12">
            <div className="grid items-start gap-4 md:gap-10">
              <div className="items-start md:flex">
                <div className="grid gap-4">
                  <h1 className="text-3xl font-bold">Producto a Intercambiar</h1>
                  <div className="flex items-center gap-4">
                    <div className="grid gap-2">
                      <h3 className="text-xl font-semibold">{mainProduct.nombre}</h3>
                      <p className="text-sm text-gray-500">{mainProduct.estado}</p>
                      <h3 className="text-x"></h3>
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
              <h2 className="text-2xl font-bold">Productos Ofrecidos</h2>
              <div className="grid gap-4">
                {offeredProducts.map((product, index) => (
                  <ProductSuggested key={index} product={product} />
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
