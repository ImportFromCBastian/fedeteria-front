//TODO : Refactor this in multiple archives
import { Payment } from '@mercadopago/sdk-react'
import { useState } from 'react'
import { initMercadoPago } from '@mercadopago/sdk-react'

initMercadoPago(`${import.meta.env.VITE_PUBLIC_KEY}`, {
  locale: 'es-AR'
})

export const PaymentBrick = () => {
  const [preferenceId, setPreferenceId] = useState(null)

  //creating preference id
  const handleOnClick = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/create_preference`, {
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => setPreferenceId(data))
      .catch((error) => console.error('Error:', error))
  }
  const initialization = {
    amount: 2500,
    preferenceId: preferenceId
  }
  const customization = {
    paymentMethods: {
      creditCard: 'all',
      debitCard: 'all',
      mercadoPago: 'all'
    }
  }
  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
    // callback llamado al hacer clic en el botón enviar datos
    return new Promise((resolve, reject) => {
      fetch('/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then((response) => response.json())
        .then((response) => {
          // recibir el resultado del pago
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
    console.log(error)
  }
  const onReady = async () => {
    /*
   Callback llamado cuando el Brick está listo.
   Aquí puede ocultar cargamentos de su sitio, por ejemplo.
 */
  }

  return (
    <div>
      {preferenceId ? (
        <Payment
          initialization={initialization}
          customization={customization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
      ) : (
        <button onClick={handleOnClick}>Checkout</button>
      )}
    </div>
  )
}
