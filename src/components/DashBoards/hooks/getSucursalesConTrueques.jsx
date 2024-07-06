export const getSucursalesConTrueques = (setData, setDisplay, setDisplay2, setDataSave) => {
  const fetchSucursalesConTrueques = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => {
        const aux = data.map((item) => {
          const fechaParts = item.fecha.split('T')[0].split('-') // Obtener partes de la fecha
          const fecha = new Date(fechaParts[0], fechaParts[1] - 1, fechaParts[2]) // Crear el objeto Date

          return {
            ...item,
            ['fechaDate']: fecha, // Asignar el objeto Date a 'fecha'
            ['fecha']: item.fecha // esta la utilizo para luego splitearla y hacer el filtro.
          }
        })
        setDataSave(aux)
        setData(aux)
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
