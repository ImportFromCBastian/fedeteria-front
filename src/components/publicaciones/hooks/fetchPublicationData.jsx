export const fetchPublicationData = () => {
  const fetchPublication = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/publication/${idPublicacion}`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => console.error(error))
    return response
  }
  return { fetchPublication }
}
