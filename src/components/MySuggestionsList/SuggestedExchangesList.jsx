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
    if (result.length === 0) {
      alert('no sugeriste')
      navigate('/')
      return
    }
    setSuggestions(result)
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  return (
    <div>
      {suggestions.map((suggestion, index) => (
        <div key={index}>
          <h1>{suggestion.productoDeseado}</h1>
          <h1>{suggestion.idTrueque}</h1>
        </div>
      ))}
    </div>
  )
}
