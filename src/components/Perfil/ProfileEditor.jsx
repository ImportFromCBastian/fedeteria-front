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
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    idLocal: '',
    mail: '',
    fechaNacimiento: ''
  })

  const { fetchSucursal, fetchUser } = fetchData()

  const gatherSucursales = async () => {
    const sucursales = await fetchSucursal()
    setSucursales(sucursales)
  }
  const gatherUser = async () => {
    const { nombre, apellido, idLocal, mail, fechaNacimiento } = await fetchUser(dni)
    setUserData({
      nombre,
      apellido,
      idLocal,
      mail,
      fechaNacimiento
    })
  }
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
      updateUser(user, dni)
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
    gatherSucursales()
    gatherUser()
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div
        className="bg-card text-card-foreground w-full max-w-2xl rounded-lg border bg-fede-secundary shadow-sm"
        data-v0-t="card"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold leading-none tracking-tight">
                ¡Edita tu, <span className="text-fede-main">fedeperfil</span>!
              </h3>
              <p className="text-muted-foreground text-sm">
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
              <select
                name="sucursal"
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
                value={userData.idLocal}
              >
                <option value="">Selecciona una sucursal</option>
                {sucursales.map((sucursal, index) => (
                  <option className="text-black" key={index} value={sucursal.idLocal}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
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