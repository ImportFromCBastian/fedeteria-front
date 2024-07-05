export async function fetchExchanges(setExchanges) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/get/last20Exchanges`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    const reversed = data.reverse()
    setExchanges(reversed)
  } catch (error) {
    console.error('Error fetching exchanges:', error)
  }
}
