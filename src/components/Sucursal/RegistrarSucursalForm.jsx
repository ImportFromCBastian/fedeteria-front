import { useState, useEffect } from 'react'
import { useHandlerSucursal } from './hooks/useHandlerSucursal'
import { Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'
export const RegistrarSucursalForm = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    nombre: '',
    calle: '',
    numero: null,
    piso: 0,
    depto: 0
  })
  const { handleChange, handleSubmit } = useHandlerSucursal(credentials, setCredentials)
  const decodeToken = async (token) => {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => data.data)
      .catch((e) => new Error(e))
  }
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/')
      return
    }

    const fetchData = async () => {
      const decodedToken = await decodeToken(token)
      if (decodedToken.rol !== 'administrador') {
        navigate('/')
        return
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex items-center justify-center ">
      <div className=" mx-4 my-5 w-full max-w-md rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md sm:mx-0">
        <h2 className="mb-6 text-center text-2xl font-bold text-fede-texto-base">
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
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-fede-texto-base">
              Nombre
            </label>
            <input
              name="nombre"
              placeholder="Ingresa el nombre de la sucursal"
              onChange={handleChange}
              className="w-full rounded-md border-2 border-gray-300 bg-fede-fondo-texto px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-fede-main"
              type="text"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="calle"
                className="mb-2 block text-sm font-medium text-fede-texto-base"
              >
                Calle
              </label>
              <input
                name="calle"
                onChange={handleChange}
                placeholder="Ingresa la calle"
                className="w-full rounded-md border-2 border-gray-300 bg-fede-fondo-texto px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-fede-main"
                type="text"
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="numero"
                className="mb-2 block text-sm font-medium text-fede-texto-base"
              >
                Numero
              </label>
              <input
                name="numero"
                onChange={handleChange}
                placeholder="Ingresa el número"
                className="w-full rounded-md border-2 border-gray-300 bg-fede-fondo-texto px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-fede-main [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none "
                type="number"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="piso" className="mb-2 block text-sm font-medium text-fede-texto-base">
                Piso
              </label>
              <input
                name="piso"
                onChange={handleChange}
                placeholder="Ingresa el piso (opcional)"
                className="w-full rounded-md border-2 border-gray-300 bg-fede-fondo-texto px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-fede-main [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="depto"
                className="mb-2 block text-sm font-medium text-fede-texto-base"
              >
                Depto
              </label>
              <input
                name="depto"
                onChange={handleChange}
                placeholder="Ingresa el depto (opcional)"
                className="w-full rounded-md border-2 border-gray-300 bg-fede-fondo-texto px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-fede-main"
                type="text"
                autoComplete="off"
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
          >
            Registrar sucursal
          </button>
        </form>
      </div>
    </div>
  )
}
