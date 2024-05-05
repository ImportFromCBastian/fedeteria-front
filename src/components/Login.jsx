import { useState, useEffect } from 'react'

export const Login = () => {
  const [attempts, setAttempts] = useState({})
  const [isLocked, setIsLocked] = useState({})
  const [credential, setCredential] = useState({ dni: '', password: '' })

  useEffect(() => {
    // Al cargar el componente, verificar si hay intentos fallidos en localStorage
    const storedAttempts = localStorage.getItem('loginAttempts')
    if (storedAttempts) {
      setAttempts(JSON.parse(storedAttempts))
    }
    console.log(localStorage)
    // Verificar si hay cuentas bloqueadas en localStorage
    const storedIsLocked = localStorage.getItem('isLocked')
    if (storedIsLocked) {
      setIsLocked(JSON.parse(storedIsLocked))
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

  const handleSubmit = (e) => {
    e.preventDefault()

    // Verificar si la cuenta está bloqueada
    if (isLocked[credential.dni]) {
      alert('Tu cuenta está bloqueada. Por favor, contacta al administrador.')
      return
    }

    // Lógica para verificar el nombre de usuario y contraseña
    // Aquí deberías tener tu lógica de autenticación

    // Simulamos una autenticación fallida
    if (credential.dni === '123' && credential.password === '123') {
      // Autenticación exitosa
      console.log('Inicio de sesión exitoso')
    } else {
      // Si se alcanza el límite de intentos fallidos (3 en este ejemplo), bloquear la cuenta
      if (attempts[credential.dni] >= 2) {
        // Cambiado a 2 porque ya se cuenta el intento actual
        setIsLocked({ ...isLocked, [credential.dni]: true })
      } else {
        // Incrementar el contador de intentos fallidos para este DNI
        const updatedAttempts = {
          ...attempts,
          [credential.dni]: (attempts[credential.dni] || 0) + 1
        }
        setAttempts(updatedAttempts)
      }
      console.log('Inicio de sesión fallido')
    }
  }

  const handleResetAttempts = () => {
    // Reiniciar los intentos fallidos de todos los DNIs al recargar la página
    setAttempts({})
    setIsLocked({})
    localStorage.removeItem('loginAttempts')
    localStorage.removeItem('isLocked')
  }

  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-yellow-300">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-600">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Ingresa tu DNI y contraseña para acceder a tu cuenta.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="dni"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              DNI
            </label>
            <input
              name="dni"
              placeholder="12345678"
              value={credential.dni}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
              type="number"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input
              name="password"
              placeholder="••••••••"
              value={credential.password}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
            className="w-full rounded-md bg-gray-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
