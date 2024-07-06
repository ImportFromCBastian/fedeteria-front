export const handlePayment = () => {
  const createPreference = async () => {
    const amount = import.meta.env.VITE_AMOUNT
    return await fetch(`${import.meta.env.VITE_BASE_URL}/create_preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    })
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error))
  }

  return { createPreference }
}
