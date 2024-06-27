export const getSucursalesConTrueques = (setData, setDisplay, setDisplay2) => {
  const fetchSucursalesConTrueques = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        const sum = data.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.CantidadDeTrueques
        }, 0)
        setDisplay(sum)
        setDisplay2(sum)
      })
      .catch((error) => console.error(error))
    return response
  }
  return { fetchSucursalesConTrueques }
}
