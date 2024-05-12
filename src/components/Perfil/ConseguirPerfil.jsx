import { useEffect, useState } from 'react'
import { ShowProfile } from './profile'

function MostrarPerfil() {
  const [perfil, setPerfil] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const dniPerfil = 44590363
    fetch(`${import.meta.env.VITE_BASE_URL}/mi_perfil/${dniPerfil}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setPerfil(data.data)
      })
      .catch((error) => {
        console.error('Error al obtener el perfil', error)
        setError(true)
      })
  }, []) // Asegúrate de pasar un array vacío como segundo argumento para que useEffect se ejecute solo una vez al montar el componente
  if (error) {
    return <div>Error al conseguir el perfil!</div>
  }
  return <ShowProfile userData={perfil.at(0)} />
}
export default MostrarPerfil
