import { useEffect, useState } from 'react'
import { CommentForm } from './DejarConsulta'
import { useParams, useNavigate } from 'react-router-dom'
import getCategory from '/src/utils/useConversor.jsx'
import { toast, Toaster } from 'sonner'

import { fetchFotosUrls } from '../../utils/fotoUtils'

export const DetallesPublicacion = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const idPublicacion = id
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [suggestPublications, setSuggestPublications] = useState([])
  const [isSuggested, setIsSuggested] = useState(false)
  const [decodedToken, setDecodedToken] = useState({})
  const [comment, setComment] = useState('')
  const [publicacion, setPublicacion] = useState({
    idPublicacion: null,
    nombre: '',
    precio: null,
    descripcion: '',
    productoACambio: '',
    estado: '',
    DNI: 0
  })
  const [fotosUrls, setFotosUrls] = useState([])
  const maxLength = 200 // Máximo de caracteres permitidos

  const decodeToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
        headers: { Authorization: `Bearer ${token}` },
        method: 'POST'
      })
      const data = await response.json()
      return data.data
    } catch (e) {
      console.error('Error decoding token:', e)
      return null
    }
  }

  const fetchSuggestion = async (token) => {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/suggestions/dni/${token.DNI}`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestPublications(data)
        return data
      })
      .catch((err) => new Error(err))
  }

  useEffect(() => {
    const fetchPublicacion = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/')
        return
      }

      const decodedToken = await decodeToken(token)

      const fetchData = async () => {
        const result = await decodeToken(token)
        const suggested = await fetchSuggestion(result)
        setDecodedToken(result)

        const filteredSuggested = suggested.filter((suggestion) => {
          return suggestion.productoDeseado === parseInt(idPublicacion)
        })
        if (filteredSuggested.length > 0) setIsSuggested(true)
      }
      await fetchData()

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}`
        )
        const data = await response.json()
        setPublicacion(data[0])
      } catch (error) {
        console.error('Error al obtener la publicación:', error)
      }
    }

    const fetchFotos = async () => {
      try {
        const urls = await fetchFotosUrls(idPublicacion)
        setFotosUrls(urls)
      } catch (error) {
        console.error('Error al obtener las fotos:', error)
      }
    }

    fetchPublicacion()
    fetchFotos()
  }, [idPublicacion, navigate])

  const eliminarPublicacion = async (idPublicacion) => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion.id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error al eliminar la publicación:', error)
    }
  }

  const aceptarPublicacion = async (idPublicacion, numero) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numero })
        }
      )
      if (!response.ok) {
        throw new Error('Error al aceptar la publicación')
      }
      toast.success('Publicación aceptada con éxito!')
      setTimeout(() => {
        navigate('/listado_publicaciones')
      }, 1000) // 1 segundo de espera
    } catch (error) {
      console.error('Error al aceptar la publicación:', error)
    }
  }

  const tienePublicaciones = async () => {
    const token = localStorage.getItem('token')
    const result = await decodeToken(token)
    const suggest = await fetch(`${import.meta.env.VITE_BASE_URL}/publication/user/${result.DNI}`)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => new Error(err))

    if (suggest.length === 0) {
      return false
    }
    return true
  }

  const handleSugerirTrueque = async () => {
    const hasPublications = await tienePublicaciones()
    if (hasPublications) {
      navigate('/sugerir_trueque/' + publicacion.idPublicacion)
    } else toast.error('No tienes productos para intercambiar!')
  }

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-1 lg:gap-12">
      <Toaster />
      <div className="grid items-start gap-4 md:gap-10">
        {decodedToken.rol === 'empleado' || decodedToken.rol === 'administrador' ? (
          <button
            onClick={() => {
              navigate(`/publicaciones/modificar_publicacion/${publicacion.idPublicacion}`)
            }}
            className="focus:ring-ring ml-auto inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
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
              className="h-5 w-5 text-fede-main"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            <span className="sr-only">Editar publicacion</span>
          </button>
        ) : null}
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
              <p>Descripción del artículo: {publicacion.descripcion}</p>
            </div>
          </div>
          <div className="ml-auto text-4xl font-bold">
            Categoria: {getCategory(publicacion.precio)}
          </div>
        </div>
        <div className="grid gap-4 md:gap-10"></div>
      </div>
      <div className="grid gap-4 md:gap-10">
        <div className="grid gap-4 rounded-md border border-fede-main bg-fede-secundary p-4 md:gap-10">
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
                  cursor: 'pointer'
                }}
              />
              <div className="mt-4 grid grid-cols-5 gap-4">
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
          {parseInt(decodedToken.DNI) !== publicacion.DNI && !isSuggested ? (
            <button
              onClick={handleSugerirTrueque}
              className="w-fit rounded border border-red-500 p-1"
            >
              Sugerir Trueque
            </button>
          ) : null}
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
                {publicacion.productoACambio === ''
                  ? 'No especificado'
                  : publicacion.productoACambio}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="grid items-start gap-4 rounded-md border border-fede-main bg-fede-secundary p-4 md:gap-10">
        <div className="grid gap-4">
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
