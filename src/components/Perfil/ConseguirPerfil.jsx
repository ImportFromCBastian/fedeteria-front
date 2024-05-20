import { useEffect, useState } from 'react'
import { ShowProfile } from './profile'

export function MostrarPerfil() {
  const [perfil, setPerfil] = useState(null)
  const [error, setError] = useState(false)

  const decodeToken = async (token) => {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => data.data)
      .catch((e) => new Error(e))
  }
  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const token = localStorage.getItem('token')
        const decodedToken = await decodeToken(token)
        const dniPerfil = decodedToken.DNI
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/mi_perfil/${dniPerfil}`)
          .then((response) => response.json())
          .then((data) => data.data[0])

        if (response.ok) {
          throw new Error('Error al obtener el perfil')
        }
        setPerfil(response)
      } catch (error) {
        console.error('Error al obtener el perfil', error)
        setError(true)
      }
    }
    obtenerPerfil()
  }, [])

  if (error) {
    return <div>Error al conseguir el perfil!</div>
  }

  if (!perfil) {
    return <div>Cargando perfil...</div>
  }

  return <ShowProfile userData={perfil} />
}

async function decodeToken(token) {
  return await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: 'POST'
  })
    .then((response) => response.json())
    .then((data) => data.data)
    .catch((e) => new Error(e))
}
