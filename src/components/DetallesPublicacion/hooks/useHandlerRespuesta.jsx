import { createRespuesta } from './createRespuesta.jsx'
import { toast } from 'sonner'
import enviarNotificacion from '../../Notificaciones/enviarNotificacion.jsx'

export const useHandlerRespuesta = (
  respuesta,
  idConsulta,
  dniDueno,
  dniConsultador,
  nombrePublicacion
) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    createRespuesta(respuesta, idConsulta, dniDueno)
    enviarNotificacion(
      'consulta',
      `El dueño de la publicacion: ${nombrePublicacion}, respondio tu consulta!`,
      dniConsultador
    )
  }

  return {
    handleSubmit
  }
}
