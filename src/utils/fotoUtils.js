// src/utils/photoUtils.js

export const convertirBlobAUrl = (fotoData) => {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([new Uint8Array(fotoData)], { type: 'image/png' })
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(blob)
    } catch (error) {
      reject(error)
    }
  })
}

export const fetchFotos = async (idPublicacion) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/add-foto/${idPublicacion}/fotos`)
    const data = await response.json()
    const urls = await Promise.all(data.map(async (foto) => convertirBlobAUrl(foto.foto.data)))
    return urls
  } catch (error) {
    console.error('Error al obtener la imagen:', error)
    throw new Error('Error al obtener las fotos')
  }
}

export const fetchFotosUrls = async (idPublicacion) => {
  try {
    const urls = await fetchFotos(idPublicacion)
    return urls
  } catch (error) {
    console.error('Error al obtener las fotos:', error)
    throw new Error('Error al obtener las fotos')
  }
}
