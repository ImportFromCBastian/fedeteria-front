import { useState } from 'react'
import { Toaster, toast } from 'sonner'

export const AddProductModal = ({ close, update }) => {
  const [product, setProduct] = useState({ nombre: '', precio: -1 })

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (product.name === '' || product.precio === -1) return toast.error('Completa los campos')
    product.precio = parseFloat(product.precio)
    const result = await fetch(`${import.meta.env.VITE_BASE_URL}/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    }).then((res) => res.json())
    console.log(result)
    if (!result.ok) return toast.error('Error al agregar el producto')
    toast.success('Producto agregado con exito')
    update()
  }

  return (
    <>
      <Toaster richColors={true} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-96 rounded-lg bg-white p-6">
          <button
            onClick={close}
            className="ring-offset-background focus-visible:ring-ring border-input b absolute right-1 top-1  mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-red-500 px-2 text-sm font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            x
          </button>
          <h1 className="mb-2 whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
            Agregando un Producto
          </h1>
          <form>
            <label htmlFor="nombre">
              Nombre del producto:
              <input
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
                name="nombre"
                placeholder="Nombre"
              />
            </label>
            <label htmlFor="precio">
              Precio del producto:
              <input
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                name="precio"
                placeholder="Precio"
              />
            </label>
          </form>
          <button
            onClick={handleSubmit}
            className="mt-4 h-10 w-full rounded-lg bg-fede-main text-white hover:scale-105"
          >
            Agregar
          </button>
        </div>
      </div>
    </>
  )
}
