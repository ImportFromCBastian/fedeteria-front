import { useState } from 'react'
import { useHandler } from './hooks/useHandler'
import { Toaster } from 'sonner'

export const PostPublictionForm = () => {
  const randomDNI = (Math.floor(Math.random() * 10000) + 1).toString()
  const [publicationData, setPublicationData] = useState({
    nombre: '',
    producto_a_cambio: '',
    dni: randomDNI,
    //fotos: '', //habria que hacer la entidad fotos??
    descripcion: '',
    estado: false //tambien se necesita dejar la fk del usuario que posteo
  })
  const { handleChange, handleSubmit, handleChangeCheck } = useHandler(
    publicationData,
    setPublicationData
  )

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-8 shadow-md sm:mx-0 dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
          Carga tu producto
        </h2>
        <Toaster
          visibleToasts={8}
          expand="true"
          richColors="true"
          toastOptions={{
            duration: 6500
          }}
        />
        <form className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre
            </label>
            <input
              name="nombre"
              placeholder="Ingresa el nombre del producto"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm [appearance:textfield] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              type="text"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="descripcion"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Descripción
              </label>
              <input
                name="descripcion"
                onChange={handleChange}
                placeholder="Ingresa la descripcion del producto"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                type="text"
              />
            </div>
            <div className="flex items-center">
              <input
                name="estado"
                onChange={handleChangeCheck}
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                type="checkbox"
              />
              <label
                htmlFor="estado"
                className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                El producto esta nuevo?
              </label>
            </div>
          </div>
          <div>
            <label
              htmlFor="producto_a_cambio"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Produto que te gustaría recibir a cambio
            </label>
            <input
              name="producto_a_cambio"
              onChange={handleChange}
              placeholder="Ingresa el producto"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              type="text"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Publicar
          </button>
        </form>
      </div>
    </div>
  )
}
