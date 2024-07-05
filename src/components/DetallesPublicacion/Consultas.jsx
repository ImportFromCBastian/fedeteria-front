import { useEffect, useState } from 'react'
import { RespuestaForm } from './DejarRespuesta'

export const Consultas = ({ consulta, decodedDNI, publicacionDNI, nombrePublicacion }) => {
  const [user, setUser] = useState({})
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const maxLength = 100 // Máximo de caracteres permitidos
  const [respuesta, setRespuesta] = useState(null)

  const toggleMostrarFormulario = () => {
    setMostrarFormulario(!mostrarFormulario)
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
    <div className="grid gap-4">
      <div className="grid gap-6">
        <div className="flex gap-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-4">
              <h3 className="text-base font-semibold">
                {user.nombre} {user.apellido}
              </h3>
              <div className="flex items-center gap-0.5"></div>
            </div>
            <p
              className="text-sm text-gray-500 dark:text-gray-400"
              style={{ wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {consulta.textoConsulta}
            </p>
            <div>
              {parseInt(decodedDNI) === publicacionDNI ? (
                consulta.idRespuesta === null ? (
                  <button
                    className="rounded-md bg-blue-500 px-2 py-1 text-xs font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={toggleMostrarFormulario}
                  >
                    Responder
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-600">
                    <span style={{ fontWeight: 'bold' }}>Respuesta:</span> {respuesta}
                  </p>
                )
              ) : consulta.idRespuesta !== null ? (
                <p className="text-sm text-gray-500 dark:text-gray-600">
                  <span style={{ fontWeight: 'bold' }}>Respuesta:</span> {respuesta}
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
