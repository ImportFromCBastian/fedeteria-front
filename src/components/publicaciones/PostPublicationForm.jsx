import { useState } from 'react'
import { useHandler } from './hooks/useHandler'
import { toast, Toaster } from 'sonner'
const MAX_PHOTOS = 4
export const PostPublicationForm = () => {
  const randomDNI = Math.floor(Math.random() * 10000) + 1
  const [publicationData, setPublicationData] = useState({
    nombre: '',
    producto_a_cambio: '',
    dni: randomDNI,
    fotos: [], //habria que hacer la entidad fotos??
    descripcion: '',
    estado: 'Nuevo' //tambien se necesita dejar la fk del usuario que posteo
  })
  const { handleChange, handleSubmit } = useHandler(publicationData, setPublicationData)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files)
    if (publicationData.fotos.length + files.length > MAX_PHOTOS) {
      // Verifica si se supera el límite
      toast.error(`Solo se permiten agregar un máximo de ${MAX_PHOTOS} fotos.`)
      setPublicationData((prevData) => ({
        ...prevData,
        fotos: [] // Reinicia el arreglo de fotos
      }))
    } else {
      setPublicationData((prevData) => ({
        ...prevData,
        fotos: prevData.fotos.concat(files) // Agrega las nuevas fotos al array existente
      }))
    }
  }
  return (
    <div className="flex h-screen items-center justify-center  ">
      <div className="mx-4 w-full max-w-[48rem] rounded-lg bg-white p-8 shadow-md ">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Carga tu producto</h2>
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
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              name="nombre"
              placeholder="Ingresa el nombre del producto"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm [appearance:textfield] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500   [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              type="text"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              {/* Esta clase hará que este div ocupe las dos columnas */}
              <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="descripcion"
                onChange={handleChange}
                placeholder="Ingresa la descripción del producto"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500  "
                style={{ resize: 'none' }} // Evita que se pueda redimensionar manualmente
                rows="4" // Altura inicial del textarea
              />
            </div>
            <div className="col-span-2">
              {' '}
              {/* Esta clase hará que este div ocupe las dos columnas */}
              <div className="flex flex-col">
                <label htmlFor="estado" className="mb-2 text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  name="estado"
                  onChange={handleChange}
                  value={publicationData.estado}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500  "
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="fotos" className="mb-2 block text-sm font-medium text-gray-700">
              Imágenes
            </label>
            <input
              onChange={handleImageChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500  "
              type="file"
              accept="image/*" // Solo permitir la selección de imágenes
              multiple // Permitir la selección múltiple de archivos
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
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Producto que te gustaría recibir a cambio
            </label>
            <input
              name="producto_a_cambio"
              onChange={handleChange}
              placeholder="Ingresa el producto"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500  "
              type="text"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Publicar
          </button>
        </form>
      </div>
    </div>
  )
}
