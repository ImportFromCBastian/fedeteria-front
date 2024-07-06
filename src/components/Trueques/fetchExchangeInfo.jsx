export async function getExchangeInfoById(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/info/${id}`)
    if (!response.ok) {
      throw new Error('Error fetching product')
    }
    const data = await response.json()
    return data[0] // Retorna el primer elemento de 'data'
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error // Lanza el error para que se maneje donde se llame esta función
  }
}
