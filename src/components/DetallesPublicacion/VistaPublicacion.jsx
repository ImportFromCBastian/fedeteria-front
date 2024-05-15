import { useEffect, useState } from 'react'
import { CommentForm } from './DejarConsulta'
import { AceptarDenegar } from './Aceptar-Denegar'

export const DetallesPublicacion = () => {
  const [comment, setComment] = useState('')
  const maxLength = 200 // Máximo de caracteres permitidos
  const idPublicacion = 12 //CONSEGUIR EL idPublicacion DE ALGUNA MANERA.
  const [publicacion, setPublicacion] = useState({
    idPublicacion: null,
    nombre: '',
    precio: null,
    descripcion: '',
    productoACambio: ''
  })

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setPublicacion(data[0])
      })
      .catch((error) => console.error('Error al obtener la publicacion:', error))
  }, [])

  const eliminarPublicacion = async (idPublicacion) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}`, {
      method: 'DELETE'
    })
      .then()
      .catch((error) => console.error('Error al eliminar la publicación:', error))
  }

  const aceptarPublicacion = async (idPublicacion, numero) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/ver_detalles/${idPublicacion}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ numero: numero }) // Envía el número como un JSON en el cuerpo de la solicitud
        }
      )

      if (!response.ok) {
        throw new Error('Error al aceptar la publicación')
      }
    } catch (error) {
      console.error('Error al aceptar la publicación:', error)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <div className="grid items-start gap-4 md:gap-10">
        <div className="hidden items-start md:flex">
          <div className="grid gap-4">
            <h1 className="text-3xl font-bold">{publicacion.nombre} Nombre</h1>
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
                <span className="text-sm font-medium">{publicacion.estado}Estado</span>
              </div>
            </div>
            <div>
              <p>Descripción del artículo{publicacion.descripcion}</p>
            </div>
          </div>
          <div className="ml-auto text-4xl font-bold">${publicacion.precio}</div>
        </div>
        <div className="grid gap-4 md:gap-10">
          <div className="grid gap-4">
            <img
              src="{foto.at(0)}" //foto de articulo,
              alt="Imagen del artículo"
              width="500"
              height="500"
              className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 object-cover dark:border-gray-800"
            />
            <div className="hidden items-start gap-4 md:flex">
              <button className="overflow-hidden rounded-lg border border-gray-500 transition-colors hover:border-black">
                <img
                  src="/placeholder.svg"
                  alt="Imagen de previsualización"
                  width="100"
                  height="100"
                  className="aspect-square object-cover"
                />
                <span className="sr-only">Ver imagen 1</span>
              </button>
              <button className="overflow-hidden rounded-lg border border-gray-500 transition-colors hover:border-black">
                <img
                  src="/placeholder.svg"
                  alt="Imagen de previsualización"
                  width="100"
                  height="100"
                  className="aspect-square object-cover"
                />
                <span className="sr-only">Ver imagen 2</span>
              </button>
              <button className="overflow-hidden rounded-lg border border-gray-500 transition-colors hover:border-black">
                <img
                  src="/placeholder.svg"
                  alt="Imagen de previsualización"
                  width="100"
                  height="100"
                  className="aspect-square object-cover"
                />
                <span className="sr-only">Ver imagen 3</span>
              </button>
              <button className="overflow-hidden rounded-lg border border-gray-500 transition-colors hover:border-black">
                <img
                  src="/placeholder.svg"
                  alt="Imagen de previsualización"
                  width="100"
                  height="100"
                  className="aspect-square object-cover"
                />
                <span className="sr-only">Ver imagen 4</span>
              </button>
            </div>
          </div>
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
                {publicacion.productoACambio} aCambio
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="grid items-start gap-4 rounded-md border border-black p-4 md:gap-10">
        <div className="grid gap-4">
          {/* {publicacion.precio === 0 && (//que el precio sea 0 y al conseguir el localCache sea un empleado, de todas maneras no tendria que poder verlo porque en listados comunes no va a existir, eso si tendriamos que dejarselo ver si es de el la publicacion */}
          <AceptarDenegar onAccept={aceptarPublicacion} onDelete={eliminarPublicacion} />
          {/* )} */}
          <h2 className="text-2xl font-bold">Consultas</h2>
          <div className="grid gap-6">
            <div className="flex gap-4">
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                <img
                  className="aspect-square h-full w-full"
                  alt="@shadcn"
                  src="/placeholder-user.jpg"
                />
                {/* imagen de usario que realizo consulta(no lo haria, en realidad ni tiene)*/}
              </span>
              <div className="grid gap-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-base font-semibold">Usuario 1</h3>{' '}
                  {/* usario que realizo consulta*/}
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
  )
}
