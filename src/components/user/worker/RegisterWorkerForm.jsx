import { useState, useEffect } from 'react'
import { RenderVisibility } from '../Visibility'
import { useHandler } from '../hooks/useHandler'
import { fetchData } from '../hooks/fetchData'
import { Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

export const RegisterWorkerForm = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [sucursal, setSucursal] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [credentials, setCredentials] = useState({
    dni: '',
    name: '',
    lastName: '',
    email: '',
    password: '',
    birthdate: '',
    notification: false
  })
  const { handleChange, handleChangePasswordVisibility, handleChangeCheck, handleSubmit } =
    useHandler(credentials, setCredentials, showPassword, setShowPassword, 'worker')

  const { fetchSucursal } = fetchData()

  const wrapper = async () => {
    const sucursales = await fetchSucursal()
    setSucursal(sucursales)
  }
  useEffect(() => {
    wrapper()
  }, [])

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

    if (token) {
      navigate('/')
      return
    }

    const fetchData = async () => {
      const decodedToken = await decodeToken(token)
      if (decodedToken.rol !== 'admin') {
        navigate('/')
        return
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex items-center justify-center">
      <div className="mx-4 my-5 w-full max-w-md rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md sm:mx-0">
        <h2 className="mb-6 text-center text-2xl font-bold text-fede-texto-base">
          Registrar Empleado
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
            <label htmlFor="dni" className="mb-2 block text-sm font-medium text-fede-texto-base">
              DNI
            </label>
            <input
              name="dni"
              placeholder="Ingresa el DNI del empleado"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm [appearance:textfield] focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              type="number"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-fede-texto-base">
                Nombre
              </label>
              <input
                name="name"
                onChange={handleChange}
                placeholder="Ingresa el nombre del empleado"
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
                type="text"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-fede-texto-base"
              >
                Apellido
              </label>
              <input
                name="lastName"
                onChange={handleChange}
                placeholder="Ingresa el apellido del empleado"
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
                type="text"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-fede-texto-base">
              Email
            </label>
            <input
              name="email"
              onChange={handleChange}
              placeholder="Ingresa el correo electronico"
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              type="email"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-fede-texto-base"
            >
              Contraseña
              <span
                className="material-symbols-outlined float-right cursor-pointer rounded-full outline-dotted"
                onClick={() => setIsOpen(!isOpen)}
              >
                question_mark
              </span>
            </label>
            <input
              name="password"
              onChange={handleChange}
              placeholder="Ingresa la contraseña"
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              type={!showPassword ? 'password' : 'text'}
            />
            <RenderVisibility show={showPassword} handleClick={handleChangePasswordVisibility} />
          </div>
          <div>
            <label
              htmlFor="birthdate"
              className="mb-2 block text-sm font-medium text-fede-texto-base"
            >
              Fecha de Nacimiento
            </label>
            <input
              name="birthdate"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              type="date"
            />
          </div>
          <div>
            <label
              htmlFor="sucursal"
              className="mb-2 block text-sm font-medium text-fede-texto-base"
            >
              Sucursal
            </label>
            <select
              name="sucursal"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
            >
              <option value="">Selecciona una sucursal</option>
              {sucursal.map((sucursal) => (
                <option className="text-black" key={sucursal.idLocal} value={sucursal.idLocal}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <input
              name="notification"
              onChange={handleChangeCheck}
              className="h-4 w-4 rounded border-gray-300 text-fede-main focus:ring-fede-main"
              type="checkbox"
            />
            <label
              htmlFor="notification"
              className="ml-2 block text-sm font-medium text-fede-texto-base"
            >
              ¿Desea recibir correos con anuncios de la plataforma?
            </label>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
          >
            Registrarse
          </button>
        </form>
        <Transition appear show={isOpen}>
          <Dialog
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={() => setIsOpen(false)}
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <TransitionChild
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 transform-[scale(95%)]"
                  enterTo="opacity-100 transform-[scale(100%)]"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 transform-[scale(100%)]"
                  leaveTo="opacity-0 transform-[scale(95%)]"
                >
                  <DialogPanel className="m-4 w-auto  rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                    <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                      Reglas de la contraseña
                    </DialogTitle>
                    <ul className="mt-2 text-sm/6 text-white/50 ">
                      <li> - La contraseña debe contener al menos 6 caracteres</li>
                      <li> - La contraseña debe contener al menos una letra mayúscula</li>
                      <li> - La contraseña debe contener algún caracter especial</li>
                      <li>
                        (!@#$%^&*()_+-=[]{}
                        ;':"\|,./?+)
                      </li>
                    </ul>
                    <div className="mt-4">
                      <button
                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                        onClick={() => setIsOpen(false)}
                      >
                        Entendido!
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  )
}
