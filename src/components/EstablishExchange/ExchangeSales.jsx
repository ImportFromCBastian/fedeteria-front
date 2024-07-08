import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchExchangeUtils } from './hooks/fetchExchangeUtils'
import { PaymentModal } from './PaymentModal'
import { AddProductModal } from './AddProductModal'
import { modalHandler } from './hooks/modalHandler'

export const ExchangeSales = ({ exchangeData }) => {
  const [productList, setProductList] = useState([{ idProducto: 0, nombre: '', precio: 0 }])
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [total, setTotal] = useState(0)
  const [modal, setModal] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { fetchProducts } = fetchExchangeUtils(setProductList)
  const { openPaymentModal, openAddProductModal, closeModal } = modalHandler(setModal)
  const navigate = useNavigate()

  const fetchClients = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/clients/${exchangeData.idTrueque}`)
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => new Error(err))
  }

  useEffect(() => {
    fetchProducts()
    fetchClients()
  }, [])

  const changeProductList = (index, action) => {
    if (action === 'remove') {
      const selected = products[index]
      setTotal(total - selected.precio)
      const newSelected = products.filter((product, i) => i !== index)
      setProducts(newSelected)
    } else if (action === 'add') {
      const selected = productList[index]
      setTotal(selected.precio + total)
      setProducts([...products, selected])
    }
  }

  const updateList = () => {
    fetchProducts()
  }

  return (
    <>
      {modal === 'payment' && (
        <PaymentModal
          price={total}
          close={closeModal}
          clients={clients}
          setProductos={setProductList}
        />
      )}
      {modal === 'addProduct' && <AddProductModal update={updateList} close={closeModal} />}
      <div className="mx-auto grid max-w-full items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
        <div className="grid gap-4 md:gap-10">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-md border px-8 text-sm font-medium transition-colors hover:bg-fede-main hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Seleccionar producto
            </button>

            {isDropdownOpen && (
              <div className="max-h-82 absolute left-0 top-full z-10 mt-2 flex w-full flex-col overflow-hidden rounded-md border bg-white shadow-lg">
                <div className="max-h-72 flex-grow overflow-y-auto">
                  <ul>
                    {productList.length === 0 && <p className="ml-4">No hay items cargados</p>}
                    {productList.map((product, index) => (
                      <li
                        key={index}
                        className="flex cursor-pointer items-center justify-between border-b p-2 hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{product.nombre} -</h3>
                          <p className="text-sm leading-none">${product.precio}</p>
                        </div>
                        <button
                          className="ring-offset-background focus-visible:ring-ring border-input bg-background b inline-flex h-7 w-7 items-center justify-center rounded-full border bg-green-500 px-2 text-sm font-medium text-white transition-colors hover:bg-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          onClick={() => {
                            changeProductList(index, 'add')
                          }}
                        >
                          +
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t">
                  <button
                    onClick={openAddProductModal}
                    className="block w-full bg-gray-100 px-4 py-2 text-center text-sm font-medium hover:bg-gray-200"
                  >
                    Cargar nuevo producto
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-4 md:gap-10">
          <div
            className="bg-card text-card-foreground rounded-lg border shadow-sm"
            data-v0-t="card"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
                Lista de productos
              </h3>

              {products.length > 0 && (
                <button
                  className="ml-auto inline-flex h-6 items-center justify-center whitespace-nowrap rounded-md bg-slate-400 px-2 text-xs font-medium transition-colors hover:bg-red-500"
                  onClick={() => {
                    setProducts([])
                    setTotal(0)
                  }}
                >
                  Borrar todos
                </button>
              )}

              {products.length > 0 ? (
                products.map((product, index) => (
                  <div key={index} className=" mb-2 flex items-center justify-between border-b ">
                    <div className="flex items-center space-x-2 ">
                      <h3 className="font-semibold">{product.nombre} -</h3>
                      <p className="text-sm leading-none">${product.precio}</p>
                    </div>
                    <button
                      className="ring-offset-background focus-visible:ring-ring border-input bg-background b mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-red-500 px-2 text-sm font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => changeProductList(index, 'remove')}
                    >
                      x
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay productos agregados</p>
              )}

              {products.length > 0 && (
                <div className="mb-4  ">
                  <div>
                    <h1>Precio Final: ${total}</h1>
                  </div>
                  <button
                    className="ring-offset-background focus-visible:ring-ring border-input bg-background b inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-fede-main hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={openPaymentModal}
                  >
                    Pagar
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="ring-offset-background focus-visible:ring-ring border-input bg-background b inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-fede-main hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Finalizar
          </button>
        </div>
      </div>
    </>
  )
}
