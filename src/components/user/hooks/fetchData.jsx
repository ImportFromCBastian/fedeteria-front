export const fetchData = () => {
  const fetchSucursal = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal`)
      .then((res) => res.json())
      .then((data) => data.data)
      .catch((error) => console.error(error))
    return response
  }
  const fetchUser = async (dni) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/client/${dni}`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => console.error(error))
    return response
  }
  return { fetchSucursal, fetchUser }
}
