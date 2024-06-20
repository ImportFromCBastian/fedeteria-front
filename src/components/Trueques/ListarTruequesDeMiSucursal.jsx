import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslateRole } from '../Perfil/useTranslateRole'
import { Exchange } from './Exchange'

export const ListarTruequesDeMiSucursal = () => {
  const [truequesINFO, setTruequesINFO] = useState([])
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
        setTruequesINFO(trueques)
      } catch (error) {
        console.error('Error al obtener los trueques', error)
      }
    }
    obtenerTruequesDeUnaSucursal()
  }, [])

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <h2 className="pl-6 pt-4 text-3xl font-bold tracking-tighter md:text-4xl">
        Trueques en la sucursal {perfil.nombreSucursal}
      </h2>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed ">
        Revisá las publicaciones llevadas a cabo en tu sucursal.
      </p>
      <div className="space-y-4 py-1 pl-6">
        {truequesINFO.length === 0 ? (
          <p>No hay trueques en tu sucursal!</p>
        ) : (
          truequesINFO.map((trueque, index) => (
            <Exchange
              key={index}
              mainPublicationID={trueque.productoDeseado}
              publicationCount={trueque.countPublication}
              exchangeID={trueque.idTrueque}
              state={trueque.realizado}
            />
          ))
        )}
      </div>
    </section>
  )
}
