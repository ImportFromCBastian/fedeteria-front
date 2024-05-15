import { useState } from 'react'
import { useHandlerSucursal } from './hooks/useHandlerSucursal'
import { Toaster } from 'sonner'

export const RegistrarSucursalForm = () => {
  const [credentials, setCredentials] = useState({
    nombre: '',
    calle: '',
    numero: null,
    piso: 0,
    depto: 0
  })
  const { handleChange, handleSubmit } = useHandlerSucursal(credentials, setCredentials)

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-8 shadow-md sm:mx-0 dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
          Registrar nueva sucursal
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
              placeholder="Ingresa el nombre de la sucursal"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm [appearance:textfield] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              type="text"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="calle"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Calle
              </label>
              <input
                name="calle"
                onChange={handleChange}
                placeholder="Ingresa la calle"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                type="text"
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="numero"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Numero
              </label>
              <input
                name="numero"
                onChange={handleChange}
                placeholder="Ingresa el número"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="piso"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Piso
              </label>
              <input
                name="piso"
                onChange={handleChange}
                placeholder="Ingresa el piso (opcional)"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="depto"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Depto
              </label>
              <input
                name="depto"
                onChange={handleChange}
                placeholder="Ingresa el depto (opcional)"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                type="text"
                autoComplete="off"
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Registrar sucursal
          </button>
        </form>
      </div>
    </div>
  )
}
