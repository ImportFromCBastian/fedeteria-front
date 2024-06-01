export const fetchPublicationData = () => {
  const fetchPublication = async (idPublicacion) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/publication/${idPublicacion}`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => data.publication)
      .catch((error) => console.error(error))
    return response
  }
  return { fetchPublication }
}
