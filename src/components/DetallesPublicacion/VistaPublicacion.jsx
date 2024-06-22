import { useEffect, useState } from 'react'
import { CommentForm } from './DejarConsulta'
import { useParams, useNavigate } from 'react-router-dom'
import getCategory from '/src/utils/useConversor.jsx'
import { toast, Toaster } from 'sonner'
import { AceptarDenegar } from './Aceptar-Denegar'
import { fetchFotosUrls } from '../../utils/fotoUtils'
import { decodeToken } from '../../utils/tokenUtils'
import enviarNotificacion from '../Notificaciones/enviarNotificacion'

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
  const [usuario, setUsuario] = useState({})
  const [fotosUrls, setFotosUrls] = useState([])
  const maxLength = 200 // Máximo de caracteres permitidos

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
    const exchangable = async () => {
      const pending = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/state/pending`)
        .then((res) => res.json())
        .then((data) => data.rows)
        .catch((err) => new Error(err))
      for (let i = 0; i < pending.length; i++) {
        if (parseInt(pending[i].productoDeseado) === parseInt(idPublicacion)) {
          setIsSuggested(true)
          break
        }
      }
    }
    const fetchPublicacion = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/')
        return
      }

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
        const userResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${data[0].DNI}`)
        const userData = await userResponse.json()
        setUsuario(userData[0])
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
    exchangable()
    fetchPublicacion()
    fetchFotos()
  }, [idPublicacion, navigate])

  const eliminarPublicacion = async (idPublicacion) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}`, {
      method: 'DELETE'
    })
      .then(() => {
        toast.success('Publicación eliminada con éxito!')
        enviarNotificacion(
          'rechazada',
          `Tu publicación ${publicacion.nombre} ha sido rechazada`,
          publicacion.DNI
        )
        // Redirige al empleado a el listado
        setTimeout(() => {
          navigate('/listado_publicaciones')
        }, 1000) // 1 segundo1 de espera
      })
      .catch((error) => console.error('Error al eliminar la publicación:', error))
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
      enviarNotificacion(
        'aceptada',
        `Tu publicación ${publicacion.nombre} ha sido aceptada`,
        publicacion.DNI
      )
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
    <div>
      <Toaster />
      <div className="flex items-center justify-center ">
        <div className="mx-auto my-5 w-full max-w-6xl rounded-md border-2 border-fede-main bg-fede-secundary p-8 shadow-md">
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
                  <h1 className="text-4xl font-bold lg:text-5xl">{publicacion.nombre}</h1>
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
                    <span className="text-sm font-medium">{publicacion.estado}</span>
                  </div>
                </div>
                {publicacion.precio !== 0 ? (
                  <h2 className="pb-2 text-2xl font-bold">{`Categoria: ${getCategory(publicacion.precio)}`}</h2>
                ) : null}

                <div className="grid gap-2">
                  <h3 className="pb-2 text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Descripción:
                  </h3>
                  <div className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border bg-fede-fondo-texto px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <p className="[&amp;:not(:first-child)]:mt-6 text-sm leading-7">
                      {publicacion.descripcion}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {parseInt(decodedToken.DNI) !== publicacion.DNI && !isSuggested ? (
                  <button
                    onClick={handleSugerirTrueque}
                    className="mt-2 w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
                  >
                    Sugerir Trueque
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          {publicacion.productoACambio && (
            <div className="grid gap-2">
              <h2 className="ml-4 mt-1 max-h-40 overflow-auto break-words text-xl font-bold">
                Producto que espera a cambio: {publicacion.productoACambio}
              </h2>
            </div>
          )}
          <h2 className="mb-4  ml-4 mt-4 text-2xl font-bold">
            Publicada por: {usuario.nombre} {usuario.apellido}
          </h2>
          <div className="grid items-start gap-4 md:gap-10">
            <div className="flex items-center justify-between">
              {decodedToken.rol === 'empleado' || decodedToken.rol === 'administrador' ? (
                <>
                  <div className="ml-4 flex items-center space-x-2">
                    {publicacion.precio == 0 && (
                      <AceptarDenegar
                        onAccept={(numero) => aceptarPublicacion(publicacion.idPublicacion, numero)}
                        onDelete={() => eliminarPublicacion(publicacion.idPublicacion)}
                      />
                    )}
                  </div>
                  <div className="ml-auto flex justify-end">
                    <button
                      onClick={() => {
                        navigate(
                          `/publicaciones/modificar_publicacion/${publicacion.idPublicacion}`
                        )
                      }}
                      className="focus:ring-ring inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
                      <span className="sr-only">Editar publicación</span>
                    </button>
                  </div>
                </>
              ) : null}
            </div>

            <div className="hidden items-start md:flex">
              <div className="grid gap-4"></div>
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
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                    <img
                      className="aspect-square h-full w-full"
                      alt="@shadcn"
                      src="/placeholder-user.jpg"
                    />
                  </span>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-base font-semibold">Usuario 2</h3>
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
                      Consulta del usuario 2 sobre el artículo.
                    </p>
                  </div>
                </div>
              </div>
              <CommentForm comment={comment} setComment={setComment} maxLength={maxLength} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
