import { useEffect, useState } from 'react'
import { PublicationList } from '../publicaciones/PublicationList'

export const HomePage = () => {
  const [publication, setPublication] = useState([])
  const fetchPublication = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/publication`)
      .then((res) => res.json())
      .then((data) => setPublication(data))
      .catch((err) => new Error(err))
  }
  useEffect(() => {
    fetchPublication()
  }, [])

  return publication.length === 0 ? (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="mx-4 my-5 w-full max-w-md rounded-lg border-4 border-fede-main bg-fede-secundary p-8 shadow-md sm:mx-0">
        <h1 className="mb-6 text-center text-2xl font-bold text-fede-texto-base">
          ¡Bienvenido a la fedetería!
        </h1>
        <h3 className="text-l mb-6 text-center font-bold text-fede-texto-base">
          ¿Estás listo para intercambiar algunos productos?
        </h3>
      </div>
    </div>
  ) : (
    <PublicationList publications={publication} />
  )
}
