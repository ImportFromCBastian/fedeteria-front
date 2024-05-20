import { toast } from 'sonner'
export const CreatePublication = async (publicationData) => {
  try {
    const result = await fetch(`${import.meta.env.VITE_BASE_URL}/publication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(publicationData)
    }).then((data) => data.json())

    if (!result.ok) {
      throw new Error('Error al agregar publicación')
    }

    // Obtener el ID de la publicación creada desde la respuesta
    const idPublicacion = result.message // Ajusta esto según la estructura de tu respuesta
    // Insertar fotos asociadas a la publicación
    for (const foto of publicationData.fotos) {
      await insertarFoto(foto, idPublicacion)
    }
    toast.success('Publicación agregada correctamente')
    return { result: result.status }
  } catch (error) {
    console.error('Error al agregar la publicación:', error)
    toast.error('Error al agregar publicación')
    throw error
  }
}

// Función para insertar una foto asociada a la publicación
const insertarFoto = async (foto, idPublicacion) => {
  try {
    const formData = new FormData()
    formData.append('foto', foto)
    formData.append('idPublicacion', parseInt(idPublicacion))
    const result = await fetch(`${import.meta.env.VITE_BASE_URL}/add-foto`, {
      method: 'POST',
      body: formData
    })
    if (!result.ok) {
      throw new Error('Error al insertar foto (mal result)')
    }
    return await result.json()
  } catch (error) {
    console.error('Error al insertar foto:', error)
    throw error
  }
}
