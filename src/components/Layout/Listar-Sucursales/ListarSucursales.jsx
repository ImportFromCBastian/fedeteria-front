import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sucursales } from './Sucursales'
import { toast } from 'sonner'

export const ListarSucursales = () => {
  const [sucursales, setSucursales] = useState([])
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

  const fetchSucursales = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal`)
      .then((response) => response.json())
      .then((data) => {
        setSucursales(data.data)
      })
      .catch((error) => console.error('Error al obtener el listado de sucursales:', error))
  }

  const eliminarSucursal = async (idLocal) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal/${idLocal}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }
      toast.success('Sucursal eliminada correctamente')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast.error(`Error al eliminar la sucursal: ${error.message}`)
      console.error('Error al eliminar la sucursal:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null) {
      navigate('/')
      return
    }

    const fetchData = async () => {
      const decodedToken = await decodeToken(token)
      if (decodedToken.rol !== 'administrador') {
        navigate('/')
        return
      }
      fetchSucursales()
    }
    fetchData()
  }, [])

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <h2 className="pl-6 pt-4 text-3xl font-bold tracking-tighter md:text-4xl">
        Listado de sucursales
      </h2>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed dark:text-gray-400"></p>

      <div className="space-y-4 px-1 py-1">
        {sucursales.length === 0 ? (
          <p>No hay sucursales que mostrar!</p>
        ) : (
          sucursales.map((sucu, index) => (
            <Sucursales
              sucursal={sucu}
              key={index}
              onDelete={() => eliminarSucursal(sucu.idLocal)}
            />
          ))
        )}
      </div>
    </section>
  )
}
