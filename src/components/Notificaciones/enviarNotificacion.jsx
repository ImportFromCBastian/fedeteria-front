export default async function enviarNotificacion(tipo, contenido, DNI) {
  try {
    if (tipo == null) {
      tipo = 'default'
    }
    const notificacion = { tipo, contenido, DNI }
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notificaciones/enviar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificacion)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al agregar notificaicon')
    }
  } catch (error) {
    console.error('Error al agregar la publicación:', error)
    throw error
  }
}
