export const fetchSucursalById = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal/get/${id}`)
    const data = await response.json()
    return data[0] // Cambiar esto para devolver la primera sucursal
  } catch (error) {
    console.error('Error fetching sucursal:', error)
  }
}
