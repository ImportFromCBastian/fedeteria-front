export async function deleteSuggestions(mainPublicationID) {
  return await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/suggestion/${mainPublicationID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => new Error(err))
}
