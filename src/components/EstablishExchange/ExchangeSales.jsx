import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchExchangeUtils } from './hooks/fetchExchangeUtils'
import { ProductList } from './ProductList'
import { PaymentModal } from './PaymentModal'
import { AddProductModal } from './AddProductModal'
import { modalHandler } from './hooks/modalHandler'

export const ExchangeSales = () => {
  const [productList, setProductList] = useState([{ idProducto: 0, nombre: '', precio: 0 }])
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [modal, setModal] = useState('')
  const { fetchProducts } = fetchExchangeUtils(setProductList)
  const { openPaymentModal, openAddProductModal, closeModal } = modalHandler(setModal)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
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
      {modal === 'payment' && <PaymentModal price={total} close={closeModal} />}
      {modal === 'addProduct' && <AddProductModal update={updateList} close={closeModal} />}
      <button
        onClick={() => navigate('/')}
        className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-md px-8 text-sm font-medium transition-colors"
      >
        Salir
      </button>
      <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
        <div className="grid gap-4 md:gap-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div className="grid gap-2">
              <div className="grid gap-1">
                {productList.map((product, index) => (
                  <ProductList
                    key={index}
                    index={index}
                    nombre={product.nombre}
                    precio={product.precio}
                    state={'toAdd'}
                    changeProductList={changeProductList}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={openAddProductModal}
            className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-md px-8 text-sm font-medium transition-colors"
          >
            Agregar producto
          </button>
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
            </div>
            {products.length > 0 && (
              <button
                className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-md bg-slate-400 px-8 text-sm font-medium transition-colors"
                onClick={() => {
                  setProducts([])
                  setTotal(0)
                }}
              >
                Borrar todo
              </button>
            )}
            <div className="p-6">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductList
                    key={index}
                    index={index}
                    nombre={product.nombre}
                    precio={product.precio}
                    state={'toShow'}
                    changeProductList={changeProductList}
                  />
                ))
              ) : (
                <p>No hay productos agregados</p>
              )}
              {total > 0 && (
                <>
                  <p>Precio Final: ${total}</p>
                  <button
                    className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-md bg-slate-400 px-8 text-sm font-medium transition-colors"
                    onClick={openPaymentModal}
                  >
                    Pagar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
