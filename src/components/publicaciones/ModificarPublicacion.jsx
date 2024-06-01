import { useEffect, useState } from 'react'
import { fetchPublicationData } from './hooks/fetchPublicationData'
import partialPublicationSchema from './hooks/validator/partialPublicationValidator'
import { toast } from 'sonner'
import { updatePublication } from './hooks/updatePublication'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export const ModificarPublicacion = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const idPublicacion = id
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [publicationData, setPublicationData] = useState({
    idPublicacion: null,
    nombre: '',
    precio: null,
    descripcion: '',
    productoACambio: '',
    estado: '',
    DNI: 0
  })
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
    } catch (error) {
      const { errors } = error
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
      return
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
      if (decodedToken.rol == 'cliente') {
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
    <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-1 lg:gap-12">
      <div className="grid items-start gap-4 md:gap-10">
        <div className="hidden  items-start md:flex">
          <div className="grid gap-4">
            <h1 className="text-3xl font-bold">
              <input
                type="text"
                name="nombre"
                value={publicationData.nombre}
                onChange={handleChange}
                placeholder="Nombre del artículo"
                className="w-full border-b border-gray-300 bg-transparent text-3xl font-bold focus:outline-none"
              />
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-0.5">
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
                  <input
                    type="text"
                    name="estado"
                    value={publicationData.estado}
                    onChange={handleChange}
                    placeholder="Estado"
                    className="w-20 border-b border-gray-300 bg-transparent text-sm font-medium focus:outline-none"
                  />
                </span>
              </div>
            </div>
            <div>
              <p>
                <textarea
                  name="descripcion"
                  value={publicationData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del artículo"
                  className="w-full border-b border-gray-300 bg-transparent focus:outline-none"
                />
              </p>
            </div>
          </div>
          <div className="ml-auto text-4xl font-bold">
            <input
              type="number"
              name="precio"
              value={publicationData.precio}
              onChange={handleChange}
              placeholder="Precio"
              className="w-20 border-b border-gray-300 bg-transparent text-4xl font-bold focus:outline-none"
            />
          </div>
        </div>
        <div className="grid gap-4 md:gap-10"></div>
      </div>
      <div className="grid gap-4 md:gap-10">
        <div className="grid items-start gap-4 rounded-md border border-fede-main bg-fede-secundary p-4 md:gap-10">
          {fotosUrls.length === 1 ? (
            // Si solo hay una foto, mostrarla sola y grande
            <img
              src={fotosUrls[0]}
              alt={`Imagen principal del artículo`}
              className="mx-auto rounded-md border border-gray-400"
              style={{ width: '800px', height: '400px', objectFit: 'contain', cursor: 'pointer' }}
            />
          ) : (
            // Si hay más de una foto, mostrar todas en miniatura
            <div>
              <img
                src={fotosUrls[selectedPhotoIndex]}
                alt={`Imagen ${selectedPhotoIndex + 1} del artículo`}
                className="mx-auto rounded-md border border-gray-400"
                style={{ width: '800px', height: '400px', objectFit: 'contain', cursor: 'pointer' }}
              />
              <div className="mt-2 grid grid-cols-4 gap-4">
                {fotosUrls.map((photoUrl, index) => (
                  <img
                    key={index}
                    src={photoUrl}
                    alt={`Imagen ${index + 1} del artículo`}
                    className="mx-auto rounded-md border border-gray-400"
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'contain',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedPhotoIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="grid gap-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="product"
              >
                Producto que espera a cambio:
              </label>
              <label
                className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="product"
              >
                <input
                  type="text"
                  name="productoACambio"
                  value={publicationData.productoACambio}
                  onChange={handleChange}
                  placeholder="Producto que espera a cambio"
                  className="w-full border-b border-gray-300 bg-transparent text-base font-medium focus:outline-none"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  )
}
