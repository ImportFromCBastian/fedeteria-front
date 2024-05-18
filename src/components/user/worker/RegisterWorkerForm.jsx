import { useState } from 'react'
import { RenderVisibility } from '../Visibility'
import { useHandler } from '../hooks/useHandler'
import { Toaster } from 'sonner'

export const RegisterWorkerForm = () => {
  const [showPassword, setShowPassword] = useState(false)
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

  return (
    <div className="flex items-center justify-center">
      <div className="mx-4 my-5 w-full max-w-md rounded-lg bg-fede-secundary p-8 shadow-md sm:mx-0">
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
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-base shadow-sm [appearance:textfield] focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main dark:border-gray-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main dark:border-gray-600"
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
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main dark:border-gray-600"
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
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main dark:border-gray-600"
              type="email"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-fede-texto-base"
            >
              Contraseña
            </label>
            <input
              name="password"
              onChange={handleChange}
              placeholder="Ingresa la contraseña"
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main dark:border-gray-600"
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
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main dark:border-gray-600"
              type="date"
            />
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
            className="w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:bg-fede-main-claro focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}
