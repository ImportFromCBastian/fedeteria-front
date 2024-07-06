export const getGanancias = (setGanancias, setGananciasSave) => {
  const fetchGanancias = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal/ganancias`, {
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
            ['fecha']: item.fecha.split('T')[0], //esta la utilizo para mostarla en la tabla(se ve: YYYY-MM-DD)
            ['fechaAux']: item.fecha // esta la utilizo para luego splitearla y hacer el filtro.
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
