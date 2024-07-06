export const fetchReadyPayment = (idPublicacion, setIsReady) => {
  const getReadyPayment = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/publication/ready/${idPublicacion}`)
      .then((response) => response.json())
      .then((data) => {
        data.ok ? setIsReady(data) : setIsReady(data)
      })
      .catch((error) => console.error('Error:', error))
  }

  return { getReadyPayment }
}
