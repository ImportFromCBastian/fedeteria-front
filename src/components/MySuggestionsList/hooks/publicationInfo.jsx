export async function publicationInfo(id, setPublication) {
  fetch(`${import.meta.env.VITE_BASE_URL}/publication/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setPublication(data)
    })
    .catch((err) => new Error(err))
}
