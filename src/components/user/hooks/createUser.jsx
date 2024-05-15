import { toast } from 'sonner'

export const createUser = async (credentials, type) => {
  let result
  if (type === 'client') {
    result = await fetch(`${import.meta.env.VITE_BASE_URL}/user/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then((res) => res.json())
      .catch((error) => new Error(error))
  } else {
    result = await fetch(`${import.meta.env.VITE_BASE_URL}/user/worker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then((res) => res.json())
      .catch((error) => new Error(error))
  }
  if (result.ok) {
    toast.success(`${type === 'worker' ? 'Empleado' : 'Cliente'} registrado correctamente`)
  } else {
    toast.error(result.message)
  }
  return { result: result.status }
}
