import { toast } from 'sonner'

export const CreatePublication = async (publicationData) => {
  console.log(publicationData + 'antes del fetch')
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/publication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(publicationData)
  })
  console.log(result + 'despues del fecth')
  if (result.ok) {
    toast.success('Publicación agregada correctamente')
  } else {
    toast.error('Error al agregar publicacion!')
  }
  return { result: result.status }
}
