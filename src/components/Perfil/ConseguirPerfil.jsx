import { useEffect, useState } from 'react'
import { ShowProfile } from './profile'

export function MostrarPerfil() {
  const [perfil, setPerfil] = useState({
    DNI: '',
    nombre: '',
    apellido: '',
    nombreSucursal: '',
    fechaNacimiento: '',
    mail: ''
  })

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
  const transformFetch = async (rol, dni) => {
    let translate
    if (rol === 'cliente') {
      translate = 'client'
    }
    if (rol === 'empleado') {
      translate = 'worker'
    }
    if (rol === 'administrador') {
      translate = 'admin'
    }
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/${translate}/${dni}`)
      .then((response) => response.json())
      .catch((e) => {
        console.log(e)
      })
  }
  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const token = localStorage.getItem('token')
        const decodedToken = await decodeToken(token)
        const [response] = await transformFetch(decodedToken.rol, decodedToken.DNI)

        if (response.ok) {
          throw new Error('Error al obtener el perfil')
        }
        setPerfil({
          ['DNI']: response.DNI,
          ['nombre']: response.nombre,
          ['apellido']: response.apellido,
          ['nombreSucursal']: response.nombreSucursal,
          ['fechaNacimiento']: response.fechaNacimiento,
          ['mail']: response.mail
        })
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
  return <ShowProfile userData={perfil} />
}
