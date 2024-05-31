import { useEffect, useState } from 'react'
import { fetchPublicationData } from './hooks/fetchPublicationData'
import partialPublicationSchema from './hooks/validator/partialPublicationValidator'
import { toast } from 'sonner'
import { updatePublication } from './hooks/updatePublication'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export const ModificarPublicacion = () => {
  const navigate = useNavigate()
  const { id } = useParams('')
  const idPublicacion = id
  const [publicationData, setPublicationData] = useState({
    idPublicacion: null,
    nombre: '',
    precio: '',
    estado: '',
    descripcion: '',
    productoACambio: ''
  })
  const { fetchPublication } = fetchPublicationData()

  const handleChange = (e) => {
    setPublicationData({
      ...publicationData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const publication = partialPublicationSchema.validateSync(publicationData)
      console.log('holaaaaaaaaaaaaaaaaaaa')
      updatePublication(publication, idPublicacion)
      navigate(`/listado_publicaciones`)
    } catch (error) {
      const { errors } = error
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
      return
    }
  }
  const gatherPublication = async () => {
    const { nombre, precio, estado, descripcion, productoACambio } =
      await fetchPublication(idPublicacion)
    setPublicationData({
      nombre,
      precio,
      estado,
      descripcion,
      productoACambio
    })
  }
  useEffect(() => {
    const gatherPublication = async () => {
      const { nombre, precio, estado, descripcion, productoACambio } =
        await fetchPublication(idPublicacion)
      setPublicationData({
        nombre,
        precio,
        estado,
        descripcion,
        productoACambio
      })
      gatherPublication()
    }
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
                ¡Edita tu, <span className="text-fede-main">publicacion</span>!
              </h3>
              <p className="text-muted-foreground text-sm">
                Actualiza los datos viejos de tu publicacion
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
                value={publicationData.nombre}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="descripcion"
              >
                descripcion
              </label>
              <input
                name="descripcion"
                type="text"
                onChange={handleChange}
                value={publicationData.descripcion}
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="descripcion"
              >
                producto a cambio
              </label>
              <input
                name="descripcion"
                type="text"
                onChange={handleChange}
                value={publicationData.productoACambio}
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              />
            </div>

            <div className="space-y-2">
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
