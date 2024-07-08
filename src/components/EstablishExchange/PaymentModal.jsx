import { useState } from 'react'
import { decodeToken } from '../../utils/tokenUtils'
import { toast } from 'sonner'

export const PaymentModal = ({ price, close, clients, setProductos }) => {
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
    if (paymentData.dniCliente === '' || paymentData.pago === '')
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
      body: JSON.stringify(paymentData)
    }).then((res) => res.json())

    if (result.ok === false) return toast.warning(`${result.error}`)
    toast.success('Pago confirmado')
    setProductos([])
    close()
  }

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-96 rounded-lg border-2 border-fede-main bg-white p-6">
        <button
          onClick={close}
          className="ring-offset-background focus-visible:ring-ring border-input b absolute right-1 top-1  mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-red-500 px-2 text-sm font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          x
        </button>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">Confirmar pago</h1>
        <form className="grid gap-4">
          <div>
            <label htmlFor="dniCliente" className="mb-1 block font-medium">
              DNI Cliente:
            </label>
            <select
              name="dniCliente"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
            >
              <option value="">Selecciona un cliente</option>
              <option value={mainClient.DNI}>{mainClient.DNI}</option>
              <option value={offeredClient.DNI}>{offeredClient.DNI}</option>
            </select>
          </div>
          <div>
            <label htmlFor="pago" className="mb-1 block font-medium">
              Método de pago:
            </label>
            <select
              name="pago"
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
            >
              <option value="">Selecciona un método</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta de crédito">Tarjeta de crédito</option>
              <option value="Tarjeta de débito">Tarjeta de débito</option>
              <option value="Transferencia bancaria">Transferencia bancaria</option>
            </select>
          </div>
        </form>
        <p className="mt-2">Precio final: ${price}</p>
        <button
          onClick={handleConfirm}
          className="hover:bg-fede-main-darker mt-4 h-10 w-full rounded-lg bg-fede-main text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-fede-main"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
