export const fetchPublicacionesFiltradas = async (setPublications, query) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/publication/get/byQuery/${query}`,
      {
        method: 'GET'
      }
    )
    const data = await response.json()
    setPublications(data)
  } catch (error) {
    console.error('Error fetching publications:', error)
  }
}
