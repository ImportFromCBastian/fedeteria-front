export const decodeToken = async (token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST'
    })
    const data = await response.json()
    return data.data
  } catch (e) {
    console.error('Error decoding token:', e)
    return null
  }
}
