import { useEffect, useState } from 'react'
import { ConsultaForm } from './DejarConsulta'
import { useParams, useNavigate } from 'react-router-dom'
import getCategory from '/src/utils/useConversor.jsx'
import { toast, Toaster } from 'sonner'
import { AceptarDenegar } from './Aceptar-Denegar'
import { fetchFotosUrls } from '../../utils/fotoUtils'
import { decodeToken } from '../../utils/tokenUtils'
import { fetchReadyPayment } from './hooks/fetchReadyPayment'
import enviarNotificacion from '../Notificaciones/enviarNotificacion'
import { Consultas } from './Consultas'
import { handlePayment } from './hooks/handlePayment'

export const DetallesPublicacion = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const idPublicacion = id
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [suggestPublications, setSuggestPublications] = useState([])
  const [isSuggested, setIsSuggested] = useState(false)
  const [isInExchange, setIsInExchange] = useState(false)
  const [decodedToken, setDecodedToken] = useState({})
  const [consulta, setConsulta] = useState('')
  const [consultas, setConsultas] = useState([])
  const [isReady, setIsReady] = useState(false)
  const { getReadyPayment } = fetchReadyPayment(id, setIsReady)
  const { createPreference } = handlePayment()
  const [publicacion, setPublicacion] = useState({
    idPublicacion: null,
    nombre: '',
    precio: null,
    descripcion: '',
    productoACambio: '',
    estado: '',
    DNI: 0,
    borrado: null
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
    getReadyPayment()
    const exchangable = async () => {
      const pending = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/state/pending`)
        .then((res) => res.json())
        .then((data) => data.rows)
        .catch((err) => new Error(err))
      for (let i = 0; i < pending.length; i++) {
        if (
          parseInt(pending[i].productoDeseado) === parseInt(idPublicacion) ||
          parseInt(pending[i].idPublicacion) === parseInt(idPublicacion)
        ) {
          setIsSuggested(true)
          break
        }
      }
    }
    const fetchConsultas = async () => {
      return await fetch(`${import.meta.env.VITE_BASE_URL}/publication/consulta/${idPublicacion}`)
        .then((res) => res.json())
        .then((data) => {
          setConsultas(data)
          return data
        })
        .catch((err) => new Error(err))
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
        isAvailableToDelete()
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
    fetchConsultas()
    exchangable()
    fetchPublicacion()
    fetchFotos()
  }, [idPublicacion, navigate])

  const eliminarPublicacion = async (idPublicacion) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/ver_detalles/logicDelete/${idPublicacion}`, {
      method: 'PATCH'
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

  const handleClickPayment = async () => {
    const preference = await createPreference()
    if (preference) {
      navigate(`/payment/${preference.id}/publicacion/${publicacion.idPublicacion}`)
    } else {
      toast.error('Error al crear la preferencia de pago')
    }
  }
  const handleClickEliminate = async () => {
    eliminarPublicacion(publicacion.idPublicacion)
  }

  const isAvailableToDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/exchange/toDelete/${idPublicacion}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await response.json()
      const pending = data || [] // Asigna un array vacío si data.rows es undefined

      if (pending.length > 0) {
        setIsInExchange(true)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      // Aquí puedes manejar el error según tus necesidades
    }
  }
  const PromocionarIcon = () => (
    <svg
      height="30px" // Ajustar el tamaño aquí
      width="30px" // Ajustar el tamaño aquí
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
        fill: 'white'
      }}
      viewBox="0 0 42 42"
      version="1.1"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsSerif="http://www.serif.com/"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path d="M4,5l0,32c0,0.552 0.448,1 1,1l32,-0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-31,-0c0,0 0,-31 0,-31c-0,-0.552 -0.448,-1 -1,-1c-0.552,0 -1,0.448 -1,1Z" />
      <path d="M10,33.008l0,-1c-0,-0.551 -0.448,-1 -1,-1c-0.552,0 -1,0.449 -1,1l0,1c-0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1Z" />
      <path d="M12,32.008l0,1c0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l0,-1c0,-0.551 -0.448,-1 -1,-1c-0.552,0 -1,0.449 -1,1Z" />
      <path d="M16,31.008l0,2c-0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l0,-2c-0,-0.551 -0.448,-1 -1,-1c-0.552,0 -1,0.449 -1,1Z" />
      <path d="M20,30.008l-0,3c0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l-0,-3c0,-0.551 -0.448,-1 -1,-1c-0.552,0 -1,0.449 -1,1Z" />
      <path d="M24,28.008l0,5c-0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l0,-5c-0,-0.551 -0.448,-1 -1,-1c-0.552,0 -1,0.449 -1,1Z" />
      <path d="M28,24.008l0,9c-0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l0,-9c-0,-0.551 -0.448,-1 -1,-1c-0.552,0 -1,0.449 -1,1Z" />
      <path d="M32,20.008l0,13c0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l0,-13c0,-0.551 -0.448,-1 -1,-1c-0.552,0 -1,0.449 -1,1Z" />
      <path d="M36,18.008l0,15c-0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l0,-15c-0,-0.551 -0.448,-1 -1,-1c-0.552,0 -1,0.449 -1,1Z" />
      <path d="M32.544,12.65l-1.19,-1.741l6.646,-0.909l-3.26,5.863l-1.061,-1.552c-2.876,2.498 -5.005,5.181 -7.279,7.538c-3.998,4.145 -8.407,7.35 -17.543,7.151c-0.552,-0.012 -0.99,-0.47 -0.978,-1.022c0.012,-0.552 0.47,-0.99 1.022,-0.978c8.362,0.183 12.4,-2.745 16.059,-6.539c2.359,-2.446 4.574,-5.227 7.584,-7.811Z" />
    </svg>
  )

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
                {publicacion.precio !== 0 || publicacion.borrado === 1 ? (
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

              {parseInt(decodedToken.DNI) !== publicacion.DNI &&
              publicacion.borrado === 0 &&
              !isSuggested ? (
                <div className="mt-4 grid gap-2">
                  {console.log('hola')}
                  <button
                    onClick={handleSugerirTrueque}
                    className="mt-2 w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2"
                  >
                    Sugerir Trueque
                  </button>
                </div>
              ) : parseInt(decodedToken.DNI) === publicacion.DNI && isReady.ok ? (
                <div className="mt-4 grid justify-end gap-2">
                  <button
                    onClick={handleClickPayment}
                    className=" mt-2 max-w-fit rounded-md bg-fede-main px-4 py-1 font-medium text-white hover:scale-105 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    disabled={isReady.publications[0].destacada === 'si' ? true : false}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Promocionar</span>
                      <PromocionarIcon />
                    </div>
                  </button>
                </div>
              ) : null}
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
                    {publicacion.precio == 0 && publicacion.borrado === 0 && (
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
              <div className="ml-4 flex items-center space-x-2">
                {publicacion.precio !== 0 &&
                  publicacion.borrado === 0 &&
                  !isInExchange &&
                  parseInt(decodedToken.DNI) === publicacion.DNI && (
                    <button
                      className="flex items-center justify-center rounded-md border border-red-500 px-4 py-2 text-red-500 hover:border-white hover:bg-red-500 hover:text-white"
                      onClick={handleClickEliminate}
                    >
                      <span className="mr-1" role="img" aria-label="trash icon">
                        🗑️
                      </span>
                      Eliminar
                    </button>
                  )}
              </div>
            </div>
            <div className="hidden items-start md:flex">
              <div className="grid gap-4"></div>
            </div>
          </div>
          <div className="grid items-start gap-4 rounded-md border border-fede-main bg-fede-secundary p-4 md:gap-10">
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Consultas</h2>
              <div className="grid gap-4">
                {consultas.length === 0 ? (
                  parseInt(decodedToken.DNI) === publicacion.DNI ? (
                    <p>Aún no hay consultas sobre tu publicacion!</p>
                  ) : (
                    <p>Se el primero en consultar!</p>
                  )
                ) : (
                  consultas.map((consulta, index) => (
                    <Consultas
                      consulta={consulta}
                      key={index}
                      decodedDNI={decodedToken.DNI}
                      decodedRol={decodedToken.rol}
                      publicacionDNI={publicacion.DNI}
                      nombrePublicacion={publicacion.nombre}
                    />
                  ))
                )}
              </div>
              {parseInt(decodedToken.DNI) !== publicacion.DNI && (
                <ConsultaForm
                  consulta={consulta}
                  setConsulta={setConsulta}
                  maxLength={maxLength}
                  idPublicacion={idPublicacion}
                  dni={decodedToken.DNI}
                  dniPublicacion={publicacion.DNI}
                  nombrePublicacion={publicacion.nombre}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
