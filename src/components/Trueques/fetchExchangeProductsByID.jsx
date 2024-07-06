export async function fetchExchangeProductsByID(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/exchange/${id}`)
    if (!response.ok) {
      throw new Error('Error fetching products')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return [] // Devuelve un array vacío u otra indicación de error según sea necesario
  }
}
