export const getClientesPorSucursal = (setClients) => {
  const fetchClients = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/client`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => {
        setClients(data)
      })
      .catch((error) => console.error(error))
    return response
  }
  return { fetchClients }
}
