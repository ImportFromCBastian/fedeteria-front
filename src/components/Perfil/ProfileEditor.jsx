import { useEffect, useState } from 'react'
import { fetchData } from '../user/hooks/fetchData'
import partialUserSchema from './validator/partialCredentialsValidator'
import { toast } from 'sonner'
import { updateUser } from '../user/hooks/updateUser'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
export const ProfileEditor = () => {
  const navigate = useNavigate()
  const { dni } = useParams('')
  const [sucursales, setSucursales] = useState([])
  const [rol, setRol] = useState('')
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    idLocal: '',
    mail: '',
    fechaNacimiento: ''
  })

  const { fetchSucursal, fetchUser } = fetchData()

  const formatFechaNacimiento = (fechaNacimiento) => {
    if (!fechaNacimiento) return '' // Manejo de caso en que la fecha no esté definida

    const fecha = new Date(fechaNacimiento)
    const dia = fecha.getDate().toString().padStart(2, '0')
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const anio = fecha.getFullYear()

    return `${dia}/${mes}/${anio}`
  }

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = partialUserSchema.validateSync(userData)
      updateUser(user, dni, rol)
      navigate(`/mi_perfil`)
    } catch (error) {
      const { errors } = error
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
      return
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const gatherUser = async (token) => {
      const tokenReal = await getToken(token)
      setRol(tokenReal.rol)
      const { data } = await fetchUser(tokenReal.rol, dni)

      const { nombre, apellido, idLocal, mail, fechaNacimiento } = data
      setUserData({
        nombre,
        apellido,
        idLocal,
        mail,
        fechaNacimiento
      })
    }
    const gatherSucursales = async () => {
      const sucursales = await fetchSucursal()
      setSucursales(sucursales)
    }

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
    const getToken = async (token) => {
      return await decodeToken(token)
    }

    gatherSucursales()
    gatherUser(token)
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center ">
      <div
        className="bg-card text-card-foreground flex min-h-[400px] w-full max-w-5xl flex-col rounded-lg border-2 border-fede-main  bg-fede-secundary p-6 shadow-sm"
        data-v0-t="card"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="my-3 text-5xl font-bold leading-none tracking-tight">
                ¡Edita tu, <span className="text-fede-main">fedeperfil</span>!
              </h3>
              <p className="text-muted-foreground text-2xl">
                Actualiza los datos viejos de tu perfil
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2 p-6">
          <form className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                name="nombre"
                type="text"
                value={userData.nombre}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="apellido"
              >
                Apellido
              </label>
              <input
                name="apellido"
                type="text"
                onChange={handleChange}
                value={userData.apellido}
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="branch"
              >
                Sucursal más cercana
              </label>
              {userData.idLocal === 'Admin' ? (
                <div className="text-xl font-bold">{userData.idLocal}</div>
              ) : (
                <select
                  name="idLocal"
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
                  value={userData.idLocal}
                >
                  <option value="">Selecciona una sucursal</option>
                  {sucursales.map((sucursal, index) => (
                    <option className="text-black" key={index} value={parseInt(sucursal.idLocal)}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <div className="font-bold">{userData.mail}</div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="dni"
              >
                DNI
              </label>
              <div className="font-bold">{dni}</div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="birthDate"
              >
                Fecha de nacimiento
              </label>
              <div className="font-bold">{formatFechaNacimiento(userData.fechaNacimiento)}</div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white  hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
