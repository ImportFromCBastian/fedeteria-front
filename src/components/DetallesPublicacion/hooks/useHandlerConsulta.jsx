import { createConsulta } from './createConsulta.jsx'
import { toast } from 'sonner'
import enviarNotificacion from '../../Notificaciones/enviarNotificacion.jsx'

export const useHandlerConsulta = (
  consulta,
  idPublicacion,
  dni,
  dniPublicacion,
  nombrePublicacion
) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    createConsulta(consulta, idPublicacion, dni)
    enviarNotificacion(
      'consulta',
      `Tienes una nueva consulta en tu publicación: ${nombrePublicacion}`,
      dniPublicacion
    )
  }

  return {
    handleSubmit
  }
}
