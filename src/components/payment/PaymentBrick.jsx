import { Payment } from '@mercadopago/sdk-react'
import { initMercadoPago } from '@mercadopago/sdk-react'
import { useParams, useNavigate } from 'react-router-dom'
import enviarNotificacion from '../Notificaciones/enviarNotificacion'

initMercadoPago(`${import.meta.env.VITE_PUBLIC_KEY}`, {
  locale: 'es-AR'
})

export const PaymentBrick = () => {
  const navigate = useNavigate()
  const { id } = useParams('')
  const { pubId } = useParams('')

  const amount = parseInt(import.meta.env.VITE_AMOUNT)

  const initialization = {
    amount,
    preferenceId: id
  }
  //creating preference id

  const customization = {
    paymentMethods: {
      creditCard: 'all',
      debitCard: 'all'
    }
  }
  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
    // callback llamado al hacer clic en el botón enviar datos
    return new Promise((resolve, reject) => {
      formData.pubId = pubId
      fetch(`${import.meta.env.VITE_BASE_URL}/process_payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then((response) => response.json())
        .then(async (response) => {
          if (response.error) {
            const result = await fetch(`${import.meta.env.VITE_BASE_URL}/publication/${pubId}`)
              .then((response) => response.json())
              .catch((error) => console.error('Error:', error))
            enviarNotificacion(
              'rechazada',
              `Error promocionando publicacion ${result.nombre}`,
              result.DNI
            )
            navigate(`/ver_publicacion/${pubId}`)
            return
          }
          const featured = async () => {
            return await fetch(`${import.meta.env.VITE_BASE_URL}/publication/featured/${pubId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then((response) => response.json())
              .catch((error) => console.error('Error:', error))
          }

          featured()
          navigate(`/ver_publicacion/${pubId}`)
          resolve()
        })
        .catch((error) => {
          // manejar la respuesta de error al intentar crear el pago
          reject()
        })
    })
  }
  const onError = async (error) => {
    // callback llamado para todos los casos de error de Brick
  }
  const onReady = async () => {
    /*
   Callback llamado cuando el Brick está listo.
   Aquí puede ocultar cargamentos de su sitio, por ejemplo.
 */
  }

  return (
    <>
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    </>
  )
}
