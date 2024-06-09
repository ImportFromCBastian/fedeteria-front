import { toast } from 'sonner'

export const useRegisterDetails = async (data, idTrueque) => {
  try {
    const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/details/${idTrueque}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    })
    if (!result.ok) {
      throw new Error('Error al registrar los datos de trueque')
    }
    toast.success('Se registraron los datos de trueque correctamente!')
    setTimeout(() => {
      window.location.reload()
    }, 500) // 1 segundo de espera
  } catch (error) {
    toast.error(error.message)
    throw error
  }
}
