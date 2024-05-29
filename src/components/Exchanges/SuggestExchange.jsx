import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const SuggestExchange = () => {
  const { id } = useParams('')
  const navigate = useNavigate()
  const [publication, setPublication] = useState({})
  const [suggestPublications, setSuggestPublications] = useState([])

  //0. gather primary publication
  const fetchPublication = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/publication/${id}`)
      .then((res) => res.json())
      .then((data) => setPublication(data))
      .catch((err) => new Error(err))
  }

  //1. gather client publications
  const gatherToken = async () => {
    const localToken = localStorage.getItem('token')
    if (localToken === null) {
      navigate('/')
      return
    }
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
      headers: {
        Authorization: `Bearer ${localToken}`
      },
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => data.data)
      .catch((e) => new Error(e))
  }
  const fetchClientPublication = async () => {
    const token = await gatherToken()
    await fetch(`${import.meta.env.VITE_BASE_URL}/publication/user/${token.DNI}`)
      .then((res) => res.json())
      .then((data) => setSuggestPublications(data))
      .catch((err) => new Error(err))
  }

  useEffect(() => {
    fetchPublication()
    fetchClientPublication()
  }, [])

  return (
    <>
      {suggestPublications.length === 0 ? (
        <h1>no hay pubs</h1>
      ) : (
        <div className="m-5 grid  grid-cols-[2fr_1fr_2fr] items-start gap-6 bg-white  lg:gap-12">
          <div className=" grid items-start gap-4 md:gap-10">
            <div className="hidden items-start md:flex">
              <div className="grid gap-4">
                <h1 className="text-3xl font-bold">Producto a Intercambiar</h1>
                <div className="flex items-center gap-4">
                  <img
                    src="/Fedeteria_Solo_Logo.svg"
                    alt="Producto a Intercambiar"
                    width="300"
                    height="300"
                    className="aspect-square overflow-hidden rounded-lg border border-gray-200 object-cover "
                  />
                  <div className="grid gap-2">
                    <h3 className="text-xl font-semibold">{publication.nombre}</h3>
                    <p className="text-sm text-gray-500 ">{publication.descripcion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="h-8 w-8 text-gray-500 "
            >
              <path d="M8 3 4 7l4 4"></path>
              <path d="M4 7h16"></path>
              <path d="m16 21 4-4-4-4"></path>
              <path d="M20 17H4"></path>
            </svg>
          </div>
          <div className="grid items-start gap-4 md:gap-10">
            <div className="flex items-start md:hidden">
              <div className="grid gap-4">
                <h1 className="text-3xl font-bold">Producto a Intercambiar</h1>
                {/* a partir de aca refactorizar en otro archivo */}
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg"
                    alt="Producto a Intercambiar"
                    width="200"
                    height="200"
                    className="aspect-square overflow-hidden rounded-lg border border-gray-200 object-cover dark:border-gray-800"
                  />
                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">Reloj de Bolsillo Vintage</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Un hermoso reloj de bolsillo con un diseño clásico y elegante.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 text-sm leading-loose md:hidden">
              <p>
                Este reloj de bolsillo vintage es una pieza única que combina la elegancia del
                pasado con la funcionalidad del presente. Su diseño clásico y su mecanismo de
                precisión lo convierten en un accesorio atemporal y de gran valor.
              </p>
            </div>
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Productos a Ofrecer</h2>
              <div className="grid gap-4">
                <div className="group relative flex items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                  <img
                    src="/Fedeteria_Solo_Logo.svg"
                    alt="Producto 1"
                    width="100"
                    height="100"
                    className="aspect-square overflow-hidden rounded-lg border border-gray-200 object-cover dark:border-gray-800"
                  />
                  <div className=" p-4 ">
                    <h3 className="text-xl font-bold">Auriculares Inalámbricos</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Audio cristalino</p>
                  </div>
                </div>
              </div>
              <hr className="flex-1  border-gray-200 " />
              <span className="text-3xl font-bold">Categoria Final: IX</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
