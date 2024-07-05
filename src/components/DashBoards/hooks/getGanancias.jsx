export const getGanancias = (setGanancias, setGananciasSave) => {
  const fetchGanancias = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal/ganancias`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => {
        const aux = data.map((item) => {
          return {
            ...item,
            ['fecha']: item.fecha.split('T')[0]
          }
        })
        setGanancias(aux)
        setGananciasSave(aux)
      })
      .catch((error) => console.error(error))
    return response
  }

  return { fetchGanancias }
}
