import { useEffect, useState } from 'react'
import { RespuestaForm } from './DejarRespuesta'
import { toast, Toaster } from 'sonner'
import { RiCornerDownRightLine } from '@remixicon/react'

export const Consultas = ({
  consulta,
  decodedDNI,
  decodedRol,
  publicacionDNI,
  nombrePublicacion
}) => {
  const [user, setUser] = useState({})
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const maxLength = 100 // Máximo de caracteres permitidos
  const [respuesta, setRespuesta] = useState(null)

  const toggleMostrarFormulario = () => {
    setMostrarFormulario(!mostrarFormulario)
  }
  const borrarConsulta = async (idConsulta) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/publication/consulta/${idConsulta}`,
        {
          method: 'DELETE'
        }
      )
      if (response.status === 200) {
        toast.success('Consulta eliminada correctamente')
        setTimeout(() => {
          window.location.reload()
        }, 1000) // 1 segundo1 de espera
      }
    } catch (error) {
      console.error('Error al borrar la consulta:', error)
    }
  }
  const fecthRespuesta = async () => {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_BASE_URL}/publication/respuesta/${consulta.idRespuesta}`,
        {
          method: 'GET'
        }
      )
      const res = await result.json()
      setRespuesta(res[0].textoRespuesta)
    } catch (error) {
      console.error('Error al conseguir la respuesta:', error)
    }
  }

  const fetchUser = async () => {
    try {
      const result = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${consulta.dniUsuario}`, {
        method: 'GET'
      })
      const res = await result.json()
      setUser(res[0])
    } catch (error) {
      console.error('Error al conseguir el usuario:', error)
    }
  }

  useEffect(() => {
    if (consulta.idRespuesta != null) {
      fecthRespuesta()
    }
    fetchUser()
  }, [consulta.dniUsuario])

  return (
    <div className="relative grid gap-2  border-b-2 ">
      {consulta.idRespuesta === null &&
        (decodedDNI === consulta.dniUsuario || decodedRol === 'administrador') && (
          <div className="absolute right-0 top-0">
            <button
              className="text-lg font-bold text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => borrarConsulta(consulta.idConsulta)}
            >
              X
            </button>
          </div>
        )}
      <div className="grid gap-4">
        <div className="flex gap-2">
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">
                {user.nombre} {user.apellido}:
              </h3>
              <div className="flex items-center gap-0.5"></div>
            </div>
            <p
              className="text-sm text-gray-800 dark:text-gray-800"
              style={{ wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {consulta.textoConsulta}
            </p>
            <div>
              {parseInt(decodedDNI) === publicacionDNI && consulta.idRespuesta === null ? (
                <button
                  className="rounded-md bg-fede-main px-2 py-1 text-xs font-semibold text-white shadow-md hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={toggleMostrarFormulario}
                >
                  Responder
                </button>
              ) : consulta.idRespuesta !== null ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  <RiCornerDownRightLine className="inline-block text-lg" /> {respuesta}
                </p>
              ) : null}
            </div>
            <div className="flex gap-4"></div>
          </div>
        </div>
      </div>
      {mostrarFormulario && (
        <RespuestaForm
          idConsulta={consulta.idConsulta}
          maxLength={maxLength}
          dniDueno={decodedDNI} // el que está respondiendo (dueño de la pub)
          dniConsultador={consulta.dniUsuario} // el que hizo la consulta
          nombrePublicacion={nombrePublicacion}
        />
      )}
    </div>
  )
}
