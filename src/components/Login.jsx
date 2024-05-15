import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const [attempts, setAttempts] = useState({})
  const [isLocked, setIsLocked] = useState({})
  const [credential, setCredential] = useState({ dni: '', password: '' })
  const navigate = useNavigate()

  useEffect(() => {
    // Al cargar el componente, verificar si hay intentos fallidos en localStorage
    const storedAttempts = localStorage.getItem('loginAttempts')
    if (storedAttempts) {
      // setAttempts(JSON.parse(storedAttempts))
    }
    // Verificar si hay cuentas bloqueadas en localStorage
    const storedIsLocked = localStorage.getItem('isLocked')
    if (storedIsLocked) {
      // setIsLocked(JSON.parse(storedIsLocked))
    }
  }, [])

  useEffect(() => {
    // Almacenar los intentos de inicio de sesión en localStorage
    localStorage.setItem('loginAttempts', JSON.stringify(attempts))
    // Almacenar las cuentas bloqueadas en localStorage
    localStorage.setItem('isLocked', JSON.stringify(isLocked))
  }, [attempts, isLocked])

  const handleChange = (e) => {
    setCredential({
      ...credential,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Verificar si credential.dni es un entero positivo
    const dniAsInt = parseInt(credential.dni, 10)
    if (isNaN(dniAsInt) || dniAsInt <= 0) {
      toast.error('ingrese un DNI valido')
      return
    }
    //Verificar si la cuenta está bloqueada ----> quitar el los "//" en caso de que ya este listo
    if (isLocked[credential.dni]) {
      alert('Tu cuenta está bloqueada. Por favor, contacta al administrador.')
      return
    }
    // Lógica para verificar el nombre de usuario y contraseña
    const user = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${credential.dni}`)
      .then((data) => data.json())
      .catch((error) => new Error(error))

    if (user.message) {
      toast.error('Los datos ingresados son incorrectos')
      return
    }
    //solicitud al backend de comparacion de contraseñas <--

    const userCredentials = {
      DNI: credential.dni,
      contra: credential.password
    }

    const compare = await fetch(`${import.meta.env.VITE_BASE_URL}/user/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userCredentials)
    })
      .then((data) => data.json())
      .catch((error) => new Error(error))

    if (!compare.ok) {
      if (attempts[credential.dni] >= 2) {
        //Cambiado a 2 porque ya se cuenta el intento actual
        setIsLocked({ ...isLocked, [credential.dni]: true })
      } else {
        // Incrementar el contador de intentos fallidos para este DNI
        const updatedAttempts = {
          ...attempts,
          [credential.dni]: (attempts[credential.dni] || 0) + 1
        }
        setAttempts(updatedAttempts)
      }
      toast.error('Inicio de sesión fallido')
    }

    const { token } = await fetch(`${import.meta.env.VITE_BASE_URL}/user/generate_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        DNI: userCredentials.DNI
      })
    })
      .then((data) => data.json())
      .catch((error) => new Error(error))

    localStorage.setItem('token', token)
    // Redirige al usuario a la homepage
    return navigate('/')
  }
  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-[#edca6f]">
      <Toaster
        visibleToasts={8}
        expand="true"
        richColors="true"
        toastOptions={{
          duration: 6500
        }}
      />
      <div className="w-full max-w-md rounded-lg  bg-white p-6 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
          <p className="text-gray-500 dark:text-gray-900">
            Ingresa tu DNI y contraseña para acceder a tu cuenta.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="dni"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-900 "
            >
              DNI
            </label>
            <input
              id="dni"
              name="dni"
              placeholder="12345678"
              value={credential.dni}
              onChange={handleChange}
              className="block w-full rounded-md border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-black dark:bg-white dark:text-black dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
              type="number"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="dark:text-gray-text-gray-900 mb-2 block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              placeholder="••••••••"
              value={credential.password}
              onChange={handleChange}
              className="block w-full rounded-md border border-black bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:bg-white dark:text-black dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
              type="password"
            />
          </div>
          <div className="flex items-start">
            <a
              target="_blank"
              href="https://www.youtube.com/watch?v=lYBUbBu4W08"
              className="ml-auto text-sm text-gray-900 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <button
            type="submit"
            className="w-full rounded-md px-5 py-2.5 text-center text-sm font-medium text-white  focus:outline-none focus:ring-4  dark:bg-black dark:hover:bg-blue-700 "
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
