import { toast } from 'sonner'
import { updateExchangeStatus } from '../../MySuggestionsList/hooks/updateExchangeStatus'

export const useHandler = (setCode, setState, code, setExchangeData, exchangeData) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const handleChildChange = (e) => {
    setCode(e.target.value)
  }

  const handleChildSubmit = async (e) => {
    e.preventDefault()
    if (code.length !== 6) return toast.error('El código debe tener 6 caracteres')
    const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/code/${code}`)
      .then((res) => res.json())
      .then((data) => {
        setExchangeData(data)
        return data
      })
      .catch((err) => new Error(err))
    if (result.message) {
      toast.error(`${result.message}`)
      return
    }
    setState('ace')
  }

  const handleAcceptExchange = async (e) => {
    e.preventDefault()
    const result = await updateExchangeStatus(exchangeData.idTrueque, 1)
    if (!result.ok) return toast.error('Error al aceptar el trueque')
    toast.success('Trueque aceptado con exito')
    toast.success('Dirigiendo a la sección de ventas')
    setState('rs')
  }

  const handleCancelExchange = async (e) => {
    e.preventDefault()
    const result = await updateExchangeStatus(exchangeData.idTrueque, 0)
    if (!result.ok) return toast.error('Error al aceptar el trueque')
    toast.success('Trueque cancelado con exito')
    delay(2000)
    setState('rs')
  }

  return { handleChildChange, handleChildSubmit, handleAcceptExchange, handleCancelExchange }
}
