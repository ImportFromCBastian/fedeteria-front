import { toast } from 'sonner'

export const createSucursal = async (credentials) => {
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then((res) => res.json())
    .catch((error) => new Error(error))
  if (result.ok) {
    toast.success('Sucursal registrada correctamente')
  } else {
    toast.error(result.message)
  }
  return { result: result.status }
}
