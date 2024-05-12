import { useEffect, useState } from 'react'
import { ShowProfile } from './profile'

function MostrarPerfil() {
  const [perfil, setPerfil] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/mi-perfil/${44590363}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setPerfil(data.data)
      })
      .catch((error) => console.error('Error al obtener el perfil', error))
  }, []) // Asegúrate de pasar un array vacío como segundo argumento para que useEffect se ejecute solo una vez al montar el componente
  return <ShowProfile userData={perfil} />
}
export default MostrarPerfil
