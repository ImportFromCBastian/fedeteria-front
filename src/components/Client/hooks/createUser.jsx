import { toast } from 'sonner'

export const createUser = async (credentials) => {
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/client`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  if (result.ok) {
    toast.success('Cliente registrado correctamente')
  } else {
    toast.error('Error al registrar el cliente')
  }
  return { result: result.status }
}
