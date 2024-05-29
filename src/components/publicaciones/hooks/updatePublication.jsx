import { toast } from 'sonner'

export const updatePublication = async (publication, idPublicacion) => {
  const formatedPublication = {
    nombre: publication.nombre,
    precio: publication.descripcion,
    estado: publication.estado,
    descripcion: publication.descripcion,
    productoACambio: publication.productoACambio
  }
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/publicaciones/${idPublicacion}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formatedPublication)
  })
    .then((res) => res.json())
    .catch((error) => new Error(error))

  if (result.ok) {
    toast.success('Publicacion actualizado correctamente')
  } else {
    toast.error(result.message)
  }
  return { result: result.status }
}
