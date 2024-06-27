import { toast } from 'sonner'

export const createConsulta = async (consulta, idPublicacion, dni) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/publication/consulta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ consulta, idPublicacion, dni })
    })

    const data = await response.json()

    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzamos un error con el código de estado
      throw new Error(`Error: ${response.status}`)
    }

    toast.success('Consulta enviada correctamente')
    setTimeout(() => {
      window.location.reload()
    }, 1000)

    return { result: response.status, data } // Devuelve el status y los datos de la respuesta
  } catch (error) {
    toast.error(error.message)
    throw error
  }
}
