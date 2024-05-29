import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ProductsExchange } from './ProductsExchange'

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
        <>
          <div className="grid grid-cols-[2fr_1fr_2fr]  gap-6 border bg-white p-10  lg:gap-12">
            <div className=" grid items-start gap-4  md:gap-10">
              <div className="items-start md:flex">
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
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Productos a Ofrecer</h2>
              <div className="grid gap-4">
                {suggestPublications.map((publication, index) => (
                  <ProductsExchange key={index} publication={publication} />
                ))}
              </div>
              <hr className="flex-1  border-gray-200 " />
              <span className="text-3xl font-bold">Categoria Final: IX</span>
              <button className=" ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md border bg-fede-main-claro px-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Confirmar
              </button>
              <button className=" ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md border px-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
