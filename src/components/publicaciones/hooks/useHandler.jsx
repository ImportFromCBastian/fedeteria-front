import { toast } from 'sonner'
import publicationSchema from './validator/PublicationValidator'
import { CreatePublication } from './CreatePublication'

export const useHandler = (publicationData, setPublicationData) => {
  const handleChange = (e) => {
    setPublicationData({
      ...publicationData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const fotoBlobs = []

    files.forEach((file) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        // Convertir la imagen a un blob
        const blob = new Blob([event.target.result], { type: file.type })
        fotoBlobs.push(blob)

        // Si todas las imágenes han sido convertidas, actualizar el estado
        if (fotoBlobs.length === files.length) {
          setPublicationData({
            ...publicationData,
            fotos: fotoBlobs
          })
        }
      }

      // Leer el contenido de la imagen como una URL de datos
      reader.readAsArrayBuffer(file)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      publicationSchema.validateSync(publicationData, { abortEarly: false })
    } catch (error) {
      const { errors } = error
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
      return
    }
    CreatePublication(publicationData)
  }

  return {
    handleChange,
    handleSubmit,
    handleImageChange
  }
}
