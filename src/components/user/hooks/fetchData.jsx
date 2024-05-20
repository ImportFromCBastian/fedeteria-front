export const fetchData = () => {
  const fetchSucursal = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal`)
      .then((res) => res.json())
      .then((data) => data.data)
      .catch((error) => console.error(error))
    return response
  }
  const fetchUser = async (rol, dni) => {
    let translate
    if (rol === 'cliente') {
      translate = 'client'
    }
    if (rol === 'empleado') {
      translate = 'worker'
    }
    if (rol === 'administrador') {
      translate = 'admin'
    }
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/${translate}/${dni}`)
      .then((response) => response.json())
      .then((data) => data)
      .catch((e) => {
        console.log(e)
      })
  }
  return { fetchSucursal, fetchUser }
}
