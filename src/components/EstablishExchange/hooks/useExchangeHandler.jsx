export const useHandler = (setCode, setState, code) => {
  const handleChildChange = (e) => {
    setCode(e.target.value)
  }

  const handleChildSubmit = async (e) => {
    e.preventDefault()
    // const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/code/${code}`)
    // if (result.length === 0) {
    //   toast.error('El código ingresado no es válido')
    //   return
    // }
    setState('ace')
    // agarrar todos los datos necesarios
  }

  const handleAcceptExchange = async (e) => {
    e.preventDefault()
    // const result = await updateExchangeStatus(id, 1)
    // if (!result.ok) return toast.error('Error al aceptar el trueque')
    // toast.success('Trueque aceptado con exito')
    setState('rs')
  }
  const handleCancelExchange = async (e) => {
    e.preventDefault()
    // const result = await updateExchangeStatus(id, 0)
    // if (!result.ok) return toast.error('Error al aceptar el trueque')
    // toast.success('Trueque cancelado con exito')
  }

  return { handleChildChange, handleChildSubmit, handleAcceptExchange, handleCancelExchange }
}
