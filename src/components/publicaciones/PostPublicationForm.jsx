import { useEffect, useState } from 'react'
import { useHandler } from './hooks/useHandler'
import { toast, Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'

const MAX_PHOTOS = 4

export const PostPublicationForm = () => {
  const navigate = useNavigate()

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

  const [publicationData, setPublicationData] = useState({
    nombre: '',
    producto_a_cambio: '',
    dni: '',
    fotos: [],
    descripcion: '',
    estado: 'Nuevo'
  })
  const { handleChange, handleSubmit } = useHandler(publicationData, setPublicationData)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/')
      return
    }

    const fetch = async () => {
      const decodedToken = await decodeToken(token)
      setPublicationData({ ...publicationData, ['dni']: decodedToken.DNI })
    }
    fetch()
  }, [])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files)
    if (publicationData.fotos.length + files.length > MAX_PHOTOS) {
      toast.error(`Solo se permiten agregar un máximo de ${MAX_PHOTOS} fotos.`)
      setPublicationData((prevData) => ({
        ...prevData,
        fotos: []
      }))
    } else {
      setPublicationData((prevData) => ({
        ...prevData,
        fotos: prevData.fotos.concat(files)
      }))
    }
  }

  return (
    <div className=" flex items-center justify-center">
      <div className=" my-5 w-full max-w-[48rem] rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-fede-texto-base">Carga tu producto</h2>
        <Toaster
          visibleToasts={8}
          expand="true"
          richColors="true"
          toastOptions={{
            duration: 6500
          }}
        />
        <form onKeyDown={handleKeyDown} className="space-y-4" autoComplete="off">
          <div>
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-fede-texto-base">
              Nombre
            </label>
            <input
              name="nombre"
              placeholder="Ingresa el nombre del producto"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input placeholder-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              type="text"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="descripcion"
                className="mb-2 block text-sm font-medium text-fede-texto-base"
              >
                Descripción
              </label>
              <textarea
                name="descripcion"
                onChange={handleChange}
                placeholder="Ingresa la descripción del producto"
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input placeholder-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
                style={{ resize: 'none' }}
                rows="4"
              />
            </div>
            <div className="col-span-2">
              <div className="flex flex-col">
                <label htmlFor="estado" className="mb-2 text-sm font-medium text-fede-texto-base">
                  Estado
                </label>
                <select
                  name="estado"
                  onChange={handleChange}
                  value={publicationData.estado}
                  className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input placeholder-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="fotos" className="mb-2 block text-sm font-medium text-fede-texto-base">
              Imágenes
            </label>
            <input
              onChange={handleImageChange}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input placeholder-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              type="file"
              accept="image/*"
              multiple
              style={{ color: 'transparent' }}
            />
            {publicationData.fotos.length > 0 && (
              <div className="mt-2 flex flex-wrap">
                {publicationData.fotos.map((foto, index) => (
                  <div key={index} className="w-1/4 p-2">
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Imagen ${index}`}
                      className="h-auto w-full rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="producto_a_cambio"
              className="mb-2 block text-sm font-medium text-fede-texto-base"
            >
              Producto que te gustaría recibir a cambio
            </label>
            <input
              name="producto_a_cambio"
              onChange={handleChange}
              placeholder="Ingresa el producto"
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input placeholder-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
              type="text"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="font-mediumhover:scale-105 w-full rounded-md bg-fede-main px-4 py-2 text-white hover:scale-105 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
          >
            Publicar
          </button>
        </form>
      </div>
    </div>
  )
}
