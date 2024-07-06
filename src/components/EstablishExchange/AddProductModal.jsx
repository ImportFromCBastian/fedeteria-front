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
        <div className="w-96 rounded-lg bg-white p-6">
          <button onClick={close} className="relative right-0 top-0 bg-fede-main p-1 text-white">
            X
          </button>
          <h1 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
            Agregar Producto
          </h1>
          <form>
            <label htmlFor="nombre">
              Nombre del producto
              <input
                onChange={handleChange}
                className="m-2"
                name="nombre"
                placeholder="Nombre del producto"
              />
            </label>
            <label htmlFor="precio">
              Precio del producto
              <input
                onChange={handleChange}
                className="m-2"
                type="number"
                name="precio"
                placeholder="Precio del producto"
              />
            </label>
          </form>
          <button onClick={handleSubmit} className="h-10 w-full rounded-lg bg-fede-main text-white">
            Agregar
          </button>
        </div>
      </div>
    </>
  )
}
