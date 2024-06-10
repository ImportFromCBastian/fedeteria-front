import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslateRole } from '../Perfil/useTranslateRole'
import { fetchExchangeMainProduct } from './fetchExchangeMainProduct'
import { fetchFotosUrls } from '../../utils/fotoUtils'

export const ListarTruequesDeMiSucursal = () => {
  const [truequesINFO, setTruequesINFO] = useState([])
  const [offeredProducts, setOfferedProducts] = useState([])
  const [offeredProductsFotos, setOfferedProductsFotos] = useState([])
  const [mainProduct, setMainProduct] = useState([])
  const [mainProductFotoUrl, setMainProductFotoUrl] = useState('')
  const [perfil, setPerfil] = useState({
    DNI: '',
    nombre: '',
    apellido: '',
    nombreSucursal: '',
    fechaNacimiento: '',
    mail: '',
    idLocal: 0
  })
  const navigate = useNavigate()

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
    const translate = useTranslateRole(rol)
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/${translate}/${dni}`)
      .then((response) => response.json())
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    const obtenerTruequesDeUnaSucursal = async () => {
      try {
        const token = localStorage.getItem('token')
        const decodedToken = await decodeToken(token)
        if (decodedToken.rol !== 'empleado' && decodedToken.rol !== 'administrador') {
          navigate('/unauthorized')
          return
        }
        const { data } = await transformFetch(decodedToken.rol, decodedToken.DNI)
        if (data.ok) {
          throw new Error('Error al obtener los datos del usuario')
        }
        setPerfil({
          ['DNI']: data.DNI,
          ['nombre']: data.nombre,
          ['apellido']: data.apellido,
          ['nombreSucursal']: data.nombreSucursal,
          ['idLocal']: data.idLocal,
          ['fechaNacimiento']: data.fechaNacimiento,
          ['mail']: data.mail
        })
        const trueques = await fetch(
          `${import.meta.env.VITE_BASE_URL}/trueques/truequeLocal/${data.idLocal}`
        )
          .then((response) => response.json())
          .catch((e) => {
            console.log(e)
          })
        console.log(trueques)
        setTruequesINFO(trueques)
      } catch (error) {
        console.error('Error al obtener los trueques', error)
      }
    }
    obtenerTruequesDeUnaSucursal()
    console.log(truequesINFO)
  }, [])

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <h2 className="pl-6 pt-4 text-3xl font-bold tracking-tighter md:text-4xl">
        Publicaciones pendientes de revisión
      </h2>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed ">
        Revisá y tomá acciones sobre las publicaciones enviadas por los usuarios.
      </p>
      <div className="space-y-4 py-1 pl-6">
        {truequesINFO.length === 0 ? (
          <p>No hay trueques en tu sucursal!</p>
        ) : (
          <p> hay trueques .-. </p>
        )}
      </div>
    </section>
  )
}
