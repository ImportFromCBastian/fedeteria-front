import { List, ListItem, Card } from '@tremor/react'
import { useEffect, useState } from 'react'
export const Consultas = ({ consulta }) => {
  const [user, setUser] = useState({})
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${consulta.dniUsuario}`, {
          //para recuperar el usuario que realizo la consulta
          method: 'GET'
        })
        const res = await result.json()
        setUser(res[0])
      } catch (error) {
        console.error('Error al conseguir el usuario:', error)
      }
    }
    fetchUser()
  }, [consulta.dniUsuario])
  return (
    <div className="grid gap-4">
      <div className="grid gap-6">
        <div className="flex gap-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-4">
              <h3 className="text-base font-semibold">
                {user.nombre}
                {''} {user.apellido}
              </h3>
              <div className="flex items-center gap-0.5"></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{consulta.textoConsulta}</p>
          </div>
        </div>
        <div className="flex gap-4"></div>
      </div>
    </div>
  )
}
