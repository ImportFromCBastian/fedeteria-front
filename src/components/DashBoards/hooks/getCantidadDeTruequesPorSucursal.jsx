export const getCantidadDeTruequesPorSucursal = (setCantidadDeTrueques) => {
  const fetchCantidadDeTruequesPorSucursal = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/cantTrueque/get`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setCantidadDeTrueques(data)
      })
      .catch((error) => console.error(error))
    return response
  }
  return { fetchCantidadDeTruequesPorSucursal }
}
