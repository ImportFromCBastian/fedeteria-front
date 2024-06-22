import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const RecuperarContraseña = () => {
  const [credential, setCredential] = useState({ dni: '' })
  const navigate = useNavigate()
  const exceptThisSymbols = ['e', 'E', '+', '-', ',']

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/')
    }
  }, [navigate])

  const handleChange = (e) => {
    setCredential({
      ...credential,
      [e.target.name]: e.target.value
    })
  }

  const sendMail = async (email, nombre) => {
    try {
      const mailResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/mailing/contrasenia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, nombre })
      })
      if (mailResponse.ok) {
        toast.success('Correo de recuperación enviado')
      } else {
        toast.error('Error al enviar el correo de recuperación')
      }
    } catch (error) {
      console.error('Error al mandar mail:', error)
      toast.error('Error al enviar el correo de recuperación')
    }
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

      if (!user || user.message) {
        toast.success('Correo de recuperación enviado')
        return
      }
      await sendMail(user[0].mail, user[0].nombre)
    } catch (error) {
      toast.error('Error durante la recuperación. Por favor, inténtelo de nuevo.')
      console.error('Error durante la recuperación:', error)
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
        <h2 className="mb-6 text-center text-2xl font-bold text-fede-texto-base">
          ¿Olvidaste tu contraseña?
        </h2>
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
          <button
            type="submit"
            className="w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
          >
            Enviar correo de recuperación
          </button>
        </form>
      </div>
    </div>
  )
}
