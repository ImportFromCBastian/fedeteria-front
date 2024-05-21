import { toast } from 'sonner'

export const createSucursal = async (credentials) => {
  try {
    const result = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then((response) => response.json())
      .then((data) => data)

    if (!result.ok) {
      // Si la respuesta no es exitosa, lanzamos un error con el código de estado
      throw new Error(`Error: ${result.status}`)
    }

    toast.success('Sucursal registrada correctamente')

    return { result: result.status }
  } catch (error) {
    toast.error(error.message)
    throw error
  }
}
