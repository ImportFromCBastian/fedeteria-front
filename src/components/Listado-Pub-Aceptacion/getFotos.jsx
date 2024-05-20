const getFoto = async (idPublicacion) => {
  fetch(`${import.meta.env.VITE_BASE_URL}/${idPublicacion}`)
    .then((response) => {
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error('No se pudieron obtener las fotos')
      }

      return response.json()
    })
    .then((data) => data.fotos)
    .catch((error) => {
      console.error('Error al obtener las fotos:', error)
    })
}
