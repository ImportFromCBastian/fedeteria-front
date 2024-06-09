export async function publicationInfo(id) {
  return fetch(`${import.meta.env.VITE_BASE_URL}/publication/${id}`)
    .then((res) => res.json())
    .catch((err) => {
      console.error('Error fetching publication info:', err)
      throw err
    })
}
