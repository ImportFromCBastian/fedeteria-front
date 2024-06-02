import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const SuggestedExchangesList = () => {
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])

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

  const fetchSuggestions = async () => {
    const token = await gatherToken()
    const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/${token.DNI}`)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => new Error(err))
    setSuggestions(result)
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <h2 className="pl-6 pt-4 text-3xl font-bold tracking-tighter md:text-4xl">
        Listado de tus sugerencias
      </h2>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed ">
        Acá podés ver las las propuestas de trueque de tus publicaciones.
      </p>
      <div className="space-y-4 py-1 pl-6">
        {suggestions.length === 0 ? (
          <p>Todavía no tenés sugerencias de trueque!</p>
        ) : (
          suggestions.map((suggestion, index) => (
            <div key={index}>
              <h1>{suggestion.productoDeseado}</h1>
              <h1>{suggestion.idTrueque}</h1>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
