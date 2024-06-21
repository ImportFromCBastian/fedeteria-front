export async function updateExchangeStatus(id, status) {
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      realizado: status
    })
  })
    .then((res) => res.json())
    .catch((error) => new Error(error))
  return result
}
