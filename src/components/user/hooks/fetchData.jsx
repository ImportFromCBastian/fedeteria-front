export const fetchData = () => {
  const fetchSucursal = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal`)
      .then((res) => res.json())
      .then((data) => data.data)
      .catch((error) => console.error(error))
    return response
  }
  return { fetchSucursal }
}
