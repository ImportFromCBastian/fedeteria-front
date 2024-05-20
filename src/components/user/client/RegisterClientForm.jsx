import { useState, useRef } from 'react'
import { RenderVisibility } from '../Visibility'
import { useHandler } from '../hooks/useHandler'
import { Toaster } from 'sonner'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

export const RegisterClientForm = () => {
  const [showPassword, setShowPassword] = useState(false)
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
    useHandler(credentials, setCredentials, showPassword, setShowPassword, 'client')

  const timerRef = useRef(null)

  const handleMouseEnter = () => {
    setShowPasswordRules(true)
  }

  const handleMouseLeave = () => {
    setShowPasswordRules(false)
  }

  const [showPasswordRules, setShowPasswordRules] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <div className="mx-4 my-5 w-full max-w-md rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md sm:mx-0">
        <h2 className="text-center text-2xl font-bold text-fede-texto-base">Registrate</h2>
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
              placeholder="Ingresa tu DNI"
              onChange={handleChange}
              className="w-full rounded-md border bg-fede-fondo-texto px-3 py-2 text-fede-texto-input placeholder-fede-texto-claro shadow-sm outline-fede-main focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
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
                placeholder="Ingresa tu nombre"
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
                placeholder="Ingresa tu apellido"
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
              placeholder="Ingresa tu correo electronico"
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                question_mark
              </span>
            </label>

            <input
              name="password"
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              type={!showPassword ? 'password' : 'text'}
            />
            <RenderVisibility show={showPassword} handleClick={handleChangePasswordVisibility} />
            {showPasswordRules && (
              <div className="absolute bottom-full left-0 mt-2 rounded-xl  bg-fede-main/40 p-4 backdrop-blur-md">
                <h3 className="text-base/7 font-medium text-fede-texto-input">
                  Reglas de la contraseña
                </h3>
                <ul className="mt-2 text-sm/6 text-fede-texto-input/50">
                  <li> - La contraseña debe contener al menos 6 caracteres</li>
                  <li> - La contraseña debe contener al menos una letra mayúscula</li>
                  <li> - La contraseña debe contener algún caracter especial</li>
                  <li>
                    (!@#$%^&*()_+-=[]{}
                    ;':"\|,./?+)
                  </li>
                </ul>
                <div className="mt-4"></div>
              </div>
            )}
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
              placeholder="YYYY-MM-DD"
              className=":bordedarkr-gray-600 w
   -full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
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
            className="w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105  hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}
