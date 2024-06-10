import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { RenderVisibility } from '../user/Visibility'

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [attempts, setAttempts] = useState({})
  const [isLocked, setIsLocked] = useState({})
  const [credential, setCredential] = useState({ dni: '', password: '' })
  const navigate = useNavigate()
  const exceptThisSymbols = ['e', 'E', '+', '-', ',']

  useEffect(() => {
    let token = localStorage.getItem('token')
    if (token === 'undefined') {
      token = null
    }
    if (token != null) {
      navigate('/')
      return
    }

    const storedAttempts = localStorage.getItem('loginAttempts')
    if (storedAttempts) {
      setAttempts(JSON.parse(storedAttempts))
    }

    const storedIsLocked = localStorage.getItem('isLocked')
    if (storedIsLocked) {
      setIsLocked(JSON.parse(storedIsLocked))
    }
  }, [])

  const avisarBloqueo = async () => {
    try {
      const userResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${credential.dni}`)
      const user = await userResponse.json()

      if (!user || user.message) {
        return
      }
      await sendMail(user[0].mail, user[0].nombre)
      alert('Tu cuenta está bloqueada. Te enviamos al mail los pasos para recuperarla.')
    } catch (error) {
      console.error('Error al enviar el correo de bloqueo')
    }
  }

  useEffect(() => {
    localStorage.setItem('loginAttempts', JSON.stringify(attempts))
    localStorage.setItem('isLocked', JSON.stringify(isLocked))
  }, [attempts, isLocked])

  const sendMail = async (email, nombre) => {
    try {
      const mailResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/mailing/bloqueo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, nombre })
      })
      if (!mailResponse.ok) {
        toast.error('Error al enviar el correo de bloqueo')
      }
    } catch (error) {
      console.error('Error al enviar el correo de bloqueo')
    }
  }

  const handleChange = (e) => {
    setCredential({
      ...credential,
      [e.target.name]: e.target.value
    })
  }

  const handleChangePasswordVisibility = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  const recuperarContraseña = () => {
    navigate('/recuperar_contraseña')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dniAsInt = parseInt(credential.dni, 10)
    if (isNaN(dniAsInt) || dniAsInt <= 0) {
      toast.error('Ingrese un DNI válido')
      return
    }

    try {
      const userResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${credential.dni}`)
      const user = await userResponse.json()

      if (user.message) {
        toast.error('Los datos ingresados son incorrectos')
        return
      }

      const userCredentials = {
        DNI: credential.dni,
        contra: credential.password
      }

      const compareResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userCredentials)
      })
      const compare = await compareResponse.json()

      if (!compare.ok) {
        if (attempts[credential.dni] >= 2) {
          setIsLocked({ ...isLocked, [credential.dni]: true })
          avisarBloqueo()
        } else {
          const updatedAttempts = {
            ...attempts,
            [credential.dni]: (attempts[credential.dni] || 0) + 1
          }
          console.log(updatedAttempts)
          setAttempts(updatedAttempts)
        }
        toast.error('Inicio de sesión fallido')
        return
      }

      const tokenResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/generate_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ DNI: userCredentials.DNI })
      })
      const { token } = await tokenResponse.json()

      if (compare.ok) {
        localStorage.setItem('token', token)
        window.location.reload()
        navigate('/')
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      toast.error('Error al iniciar sesión')
    }
  }

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <Toaster
        visibleToasts={8}
        expand="true"
        richColors="true"
        toastOptions={{
          duration: 6500
        }}
      />
      <div className="mx-4 my-5 w-full max-w-md rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md sm:mx-0">
        <h2 className="mb-6 text-center text-2xl font-bold text-fede-texto-base">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dni" className="mb-2 block text-sm font-medium text-fede-texto-base">
              DNI
            </label>
            <input
              id="dni"
              name="dni"
              placeholder="12345678"
              value={credential.dni}
              onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
              onWheel={(e) => e.target.blur()}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-base shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
              type="number"
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
              id="password"
              name="password"
              placeholder="••••••••"
              value={credential.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-base shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              required
              type={!showPassword ? 'password' : 'text'}
            />
            <RenderVisibility show={showPassword} handleClick={handleChangePasswordVisibility} />
          </div>

          <div className="flex items-start">
            <a
              className="ml-auto text-sm text-fede-texto-base hover:underline"
              onClick={recuperarContraseña}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
