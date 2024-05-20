import { useEffect, useState } from 'react'
import { CommentForm } from './DejarConsulta'
import { AceptarDenegar } from './Aceptar-Denegar'
import { useParams, useNavigate } from 'react-router-dom'

export const DetallesPublicacion = () => {
  const { idPublicacion } = useParams()
  const navigate = useNavigate()
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [comment, setComment] = useState('')
  const maxLength = 200
  const [publicacion, setPublicacion] = useState({
    idPublicacion: null,
    nombre: '',
    precio: null,
    descripcion: '',
    productoACambio: ''
  })
  const [fotos, setFotos] = useState([])
  const [fotosUrls, setFotosUrls] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/')
      return
    }

    const fetchData = async () => {
      const decodedToken = await decodeToken(token)
      if (decodedToken.rol === 'cliente') {
        navigate('/')
        return
      }
      await fetchPublicacion()
      await fetchFoto()
    }
    fetchData()
  }, [idPublicacion, navigate])

  const fetchPublicacion = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}`)
      const data = await response.json()
      setPublicacion(data[0])
    } catch (error) {
      console.error('Error al obtener la publicación:', error)
    }
  }

  const fetchFoto = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}/fotos`
      )
      const data = await response.json()
      setFotos(data)
    } catch (error) {
      console.error('Error al obtener la imagen:', error)
    }
  }

  const eliminarPublicacion = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error al eliminar la publicación:', error)
    }
  }

  const aceptarPublicacion = async (numero) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ numero })
        }
      )

      if (!response.ok) {
        throw new Error('Error al aceptar la publicación')
      }
    } catch (error) {
      console.error('Error al aceptar la publicación:', error)
    }
  }

  const convertirBlobAUrl = (foto) => {
    const base64String = btoa(String.fromCharCode(...new Uint8Array(foto.data)))
    return `data:image/png;base64,${base64String}`
  }

  useEffect(() => {
    if (fotos.length > 0) {
      const urls = fotos.map((foto) => convertirBlobAUrl(foto))
      setFotosUrls(urls)
    }
  }, [fotos])

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-1 lg:gap-12">
      <div className="grid items-start gap-4 md:gap-10">
        <div className="hidden items-start md:flex">
          <div className="grid gap-4">
            <h1 className="text-3xl font-bold">{publicacion.nombre}</h1>
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
                <span className="text-sm font-medium">{publicacion.estado}</span>
              </div>
            </div>
            <div>
              <p>{publicacion.descripcion}</p>
            </div>
          </div>
          <div className="ml-auto text-4xl font-bold">${publicacion.precio}</div>
        </div>
        <div className="grid gap-4 md:gap-10"></div>
      </div>
      <div className="grid gap-4 md:gap-10">
        <div className="grid items-start gap-4 rounded-md border border-black p-4 md:gap-10">
          <img
            src={fotosUrls[selectedPhotoIndex]}
            alt={`Imagen ${selectedPhotoIndex + 1} del artículo`}
            className="mx-auto"
            style={{ maxWidth: '100%', maxHeight: '400px', cursor: 'pointer' }}
          />
          <div className="grid grid-cols-3 gap-4">
            {fotosUrls.map((photoUrl, index) => (
              <img
                key={index}
                src={photoUrl}
                alt={`Imagen ${index + 1} del artículo`}
                className="mx-auto"
                style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                onClick={() => setSelectedPhotoIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="product"
              >
                Producto que espera a cambio
              </label>
              <label
                className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="product"
              >
                {publicacion.productoACambio}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="grid items-start gap-4 rounded-md border border-black bg-fede-secundary p-4 md:gap-10">
        <div className="grid gap-4">
          <AceptarDenegar
            onAccept={(numero) => aceptarPublicacion(numero)}
            onDelete={() => eliminarPublicacion()}
          />
          <h2 className="text-2xl font-bold">Consultas</h2>
          <div className="grid gap-6">
            <div className="flex gap-4">
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                <img
                  className="aspect-square h-full w-full"
                  alt="@shadcn"
                  src="/placeholder-user.jpg"
                />
              </span>
              <div className="grid gap-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-base font-semibold">Usuario 1</h3>
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
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
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
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
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
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
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
                      className="fill-muted stroke-muted-foreground h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
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
                      className="fill-muted stroke-muted-foreground h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Consulta del usuario 1 sobre el artículo.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-base font-semibold">Usuario 2</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Consulta del usuario 2 sobre el artículo.
                </p>
              </div>
            </div>
          </div>
          <CommentForm comment={comment} setComment={setComment} maxLength={maxLength} />
        </div>
      </div>
    </div>
  )
}
