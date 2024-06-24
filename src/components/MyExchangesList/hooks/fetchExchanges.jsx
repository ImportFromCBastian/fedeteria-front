import { decodeToken } from '../../../utils/tokenUtils'
export async function fetchExchanges(setExchanges) {
  try {
    // Obtener el token de localStorage de manera asíncrona
    const token = localStorage.getItem('token')

    const decodedToken = await decodeToken(token)
    if (!decodedToken || !decodedToken.DNI) {
      throw new Error('Decoded token or DNI not found')
    }

    // Realizar la solicitud fetch utilizando el DNI del usuario
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/exchange/all/${decodedToken.DNI}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    const reversed = data.reverse()
    setExchanges(reversed)
  } catch (error) {
    console.error('Error fetching exchanges:', error)
    // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
  }
}
