import { useEffect, useState } from 'react'
import { fetchPublicationData } from './hooks/fetchPublicationData'
import partialPublicationSchema from './hooks/validator/partialPublicationValidator'
import { toast, Toaster } from 'sonner'
import { updatePublication } from './hooks/updatePublication'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export const ModificarPublicacion = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const idPublicacion = id
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [publicationData, setPublicationData] = useState({
    nombre: '',
    precio: 0,
    descripcion: '',
    productoACambio: '',
    estado: '',
    DNI: 0
  })
  const [usuario, setUsuario] = useState({})
  const [fotosUrls, setFotosUrls] = useState([])
  const [fotos, setFotos] = useState([])
  const { fetchPublication } = fetchPublicationData()

  const handleChange = (e) => {
    setPublicationData({
      ...publicationData,
      [e.target.name]: e.target.value
    })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const publication = partialPublicationSchema.validateSync(publicationData)
      updatePublication(publication, idPublicacion)
      navigate(`/ver_publicacion/${idPublicacion}`)
      return
    } catch (error) {
      const { errors } = error
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
    }
  }
  useEffect(() => {
    let token = localStorage.getItem('token')
    if (token === undefined) {
      token = null
    }
    if (token === null) {
      navigate('/')
      return
    }
    const fetchData = async () => {
      const decodedToken = await decodeToken(token)
      if (decodedToken.rol !== 'administrador' && decodedToken.rol !== 'empleado') {
        navigate('/')
        return
      }
    }
    const gatherPublication = async () => {
      const result = await fetchPublication(idPublicacion)
      const { nombre, precio, estado, descripcion, productoACambio } = result
      setPublicationData({
        idPublicacion,
        nombre,
        precio,
        estado,
        descripcion,
        productoACambio
      })
      const userResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${result.DNI}`)
      const userData = await userResponse.json()
      setUsuario(userData[0])
    }
    const fetchFotos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/add-foto/${idPublicacion}/fotos`
        )
        const data = await response.json()
        const urls = await Promise.all(data.map(async (foto) => convertirBlobAUrl(foto.foto.data)))
        setFotosUrls(urls)
      } catch (error) {
        console.error('Error al obtener la imagen:', error)
      }
    }
    fetchData()
    gatherPublication()
    fetchFotos()
  }, [idPublicacion])

  const convertirBlobAUrl = (fotoData) => {
    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob([new Uint8Array(fotoData)], { type: 'image/png' })
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(blob)
      } catch (error) {
        reject(error)
      }
    })
  }

  useEffect(() => {
    // Verificar si hay fotos
    if (fotos.length > 0) {
      // Convertir cada foto a una URL de datos
      Promise.all(fotos.map((foto) => convertirBlobAUrl(foto.foto)))
        .then((urls) => {
          // Actualizar el estado con las URLs de las imágenes convertidas
          setFotosUrls(urls)
        })
        .catch((error) => {
          console.error('Error al convertir blobs a URLs:', error)
        })
    }
  }, [fotos])

  return (
    <div>
      <Toaster />
      <div className="flex items-center justify-center ">
        <div className="mx-auto my-5 w-full max-w-6xl rounded-md border-2 border-fede-main bg-fede-secundary p-8 shadow-md">
          <h1 className="ml-4 justify-center text-3xl font-bold">Modificando publicación</h1>
          <div className="relative mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
            <div className="grid items-start gap-4 md:gap-10">
              <div className="group relative grid overflow-hidden rounded-lg [grid-template-areas:stack]">
                {fotosUrls.length === 1 ? (
                  <img
                    src={fotosUrls[0]}
                    alt={`Imagen principal del artículo`}
                    className="mx-auto rounded-md border border-gray-400"
                    style={{
                      width: '800px',
                      height: '400px',
                      objectFit: 'contain',
                      cursor: 'pointer'
                    }}
                  />
                ) : (
                  <div>
                    <img
                      src={fotosUrls[selectedPhotoIndex]}
                      alt={`Imagen ${selectedPhotoIndex + 1} del artículo`}
                      className="mx-auto rounded-md border border-gray-400"
                      style={{
                        width: '800px',
                        height: '400px',
                        objectFit: 'contain',
                        cursor: 'pointer',
                        background: 'white'
                      }}
                    />
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {fotosUrls.map((photoUrl, index) => (
                        <img
                          key={index}
                          src={photoUrl}
                          alt={`Imagen ${index + 1} del artículo`}
                          className="mx-auto rounded-md border border-gray-400"
                          style={{
                            width: '200px',
                            height: '100px',
                            objectFit: 'contain',
                            cursor: 'pointer',
                            background: 'white'
                          }}
                          onClick={() => setSelectedPhotoIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid items-start gap-4 md:gap-2">
              <div className="grid gap-4">
                <div className="flex items-center justify-between gap-0.5">
                  <h1 className="text-4xl font-bold lg:text-5xl">
                    <input
                      type="text"
                      className="border-b- w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input placeholder-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      value={publicationData.nombre}
                      onChange={handleChange}
                      name="nombre"
                    />
                  </h1>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="fill-primary h-5 w-5"
                    >
                      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
                      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </svg>
                    <span className="text-sm font-medium">
                      <select
                        className="border-b-2 border-black"
                        value={publicationData.estado}
                        onChange={handleChange}
                        name="estado"
                      >
                        <option value="Nuevo">Nuevo</option>
                        <option value="Usado">Usado</option>
                      </select>
                    </span>
                  </div>
                </div>

                {publicationData.precio !== 0 && (
                  <div className="flex items-center">
                    <h2 className=" text-2xl font-bold">Precio: </h2>
                    <input
                      type="number"
                      className="ml-2 w-full rounded-md border border-b border-gray-300 bg-fede-fondo-texto px-3 py-2 text-2xl font-bold text-fede-texto-input placeholder-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      value={publicationData.precio}
                      onChange={handleChange}
                      name="precio"
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <h3 className="pb-2 text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Descripción:
                  </h3>
                  <textarea
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border bg-fede-fondo-texto px-3 py-2 text-sm text-fede-texto-input placeholder-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ resize: 'vertical' }}
                    value={publicationData.descripcion}
                    onChange={handleChange}
                    name="descripcion"
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <div className="mt-4 grid gap-2">
                  <button
                    onClick={handleSubmit}
                    className="mt-2 w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <h2 className="ml-4 text-xl font-bold">Producto que espera a cambio:</h2>
            <input
              type="text"
              className="ml-2 flex-grow rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-xl font-bold text-fede-texto-input placeholder-fede-texto-claro shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={publicationData.productoACambio}
              onChange={handleChange}
              name="productoACambio"
            />
          </div>

          <h2 className="mb-4  ml-4 mt-4 text-2xl font-bold">
            Esta publicación es del usuario: {usuario.nombre} {usuario.apellido}
          </h2>
          <div className="grid items-start gap-4 md:gap-10">
            <div className="hidden items-start md:flex">
              <div className="grid gap-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
