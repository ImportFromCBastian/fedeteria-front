export async function createPendingExchange(id) {
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/suggestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  }).then((res) => res.json())
  return result
}
