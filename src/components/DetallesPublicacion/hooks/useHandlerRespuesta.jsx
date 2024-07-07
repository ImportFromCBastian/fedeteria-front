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
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createRespuesta(respuesta, idConsulta, dniDueno)
      await enviarNotificacion(
        'consulta',
        `El dueño de la publicacion: ${nombrePublicacion}, respondio tu consulta!`,
        dniConsultador
      )
    } catch (error) {
      console.error('Error al enviar respuesta:', error)
      toast.error('Error al enviar respuesta')
    }
  }

  return {
    handleSubmit
  }
}
