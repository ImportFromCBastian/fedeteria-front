import { toast } from 'sonner'

export const createRespuesta = async (respuesta, idConsulta, dniDueno) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/publication/respuesta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ respuesta, idConsulta, dniDueno })
    })
    const data = await response.json()
    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzamos un error con el código de estado
      throw new Error(`Error: ${response.status}`)
    }
    if (data) {
      console.log('actualizamos consulta con idRespuesta:', data)
      const responseConsulta = await fetch(
        `${import.meta.env.VITE_BASE_URL}/publication/consulta/${idConsulta}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data })
        }
      )
    }
    toast.success('Respuesta enviada correctamente')
    // setTimeout(() => {
    //   window.location.reload()
    // }, 500)

    return { result: response.status, data } // Devuelve el status y los datos de la respuesta
  } catch (error) {
    toast.error(error.message)
    throw error
  }
}
