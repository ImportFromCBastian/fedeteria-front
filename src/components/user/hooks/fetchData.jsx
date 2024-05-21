import { useTranslateRole } from '../../Perfil/useTranslateRole'

export const fetchData = () => {
  const fetchSucursal = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sucursal`)
      .then((res) => res.json())
      .then((data) => data.data)
      .catch((error) => console.error(error))
    return response
  }
  const fetchUser = async (rol, dni) => {
    const translate = useTranslateRole(rol)
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/${translate}/${dni}`)
      .then((response) => response.json())
      .then((data) => data)
      .catch((e) => {
        console.log(e)
      })
  }
  return { fetchSucursal, fetchUser }
}
