import { useState } from 'react'
import { decodeToken } from '../../utils/tokenUtils'
import { toast } from 'sonner'

export const PaymentModal = ({ price, close, clients }) => {
  const [mainClient] = clients[0]
  const [offeredClient] = clients[1]
  const [paymentData, setPaymentData] = useState({
    dniCliente: '',
    pago: '',
    dniEmpleado: '',
    precio: price,
    idLocal: 0
  })

  const handleConfirm = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const worker = await decodeToken(token)
    paymentData.dniEmpleado = worker.DNI
    if (paymentData.dniCliente === '' || paymentData.pago === 0)
      return toast.warning('Completa los campos')

    const local = await fetch(`${import.meta.env.VITE_BASE_URL}/user/worker/${worker.DNI}`)
      .then((res) => res.json())
      .then((data) => data.data.idLocal)
      .catch((err) => console.log(err))

    if (local === undefined || local === null) return toast.warning('No tienes un local asignado')
    paymentData.idLocal = local

    const result = await fetch(`${import.meta.env.VITE_BASE_URL}/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentData })
    }).then((res) => res.json())

    if (result.ok === false) return toast.warning(`${result.error}`)
    toast.success('Pago confirmado')
    close()
  }
  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6">
        <button onClick={close} className="relative right-0 top-0 bg-fede-main p-1 text-white">
          X
        </button>
        <h1 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
          Confirmar pago
        </h1>
        <select name="dniCliente" onChange={handleChange}>
          <option value="0">Selecciona un cliente</option>
          <option value={mainClient.DNI}>{mainClient.DNI}</option>
          <option value={offeredClient.DNI}>{offeredClient.DNI}</option>
        </select>
        <select name="pago" onChange={handleChange}>
          <option value="0">Selecciona un metodo</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta de credito">Tarjeta de crédito</option>
          <option value="Tarjeta de debito">Tarjeta de débito</option>
          <option value="Transferencia">Transferencia bancaria</option>
        </select>
        <p>Precio final: ${price}</p>
        <button onClick={handleConfirm} className="h-10 w-full rounded-lg bg-fede-main text-white">
          Confirmar
        </button>
      </div>
    </div>
  )
}
