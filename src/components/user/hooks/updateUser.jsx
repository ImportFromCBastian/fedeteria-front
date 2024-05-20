import { toast } from 'sonner'

export const updateUser = async (credentials, dni, rol) => {
  let translate
  if (rol === 'cliente') {
    translate = 'client'
  }
  if (rol === 'empleado') {
    translate = 'worker'
  }
  if (rol === 'administrador') {
    translate = 'admin'
  }
  const formatedCredentials = {
    nombre: credentials.nombre,
    apellido: credentials.apellido,
    idLocal: credentials.idLocal
  }
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${translate}/${dni}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formatedCredentials)
  })
    .then((res) => res.json())
    .catch((error) => new Error(error))

  if (result.ok) {
    toast.success('Perfil actualizado correctamente')
  } else {
    toast.error(result.message)
  }
  return { result: result.status }
}
