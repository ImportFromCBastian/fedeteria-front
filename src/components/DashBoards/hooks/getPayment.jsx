export const getPayment = (setTotal) => {
  const getAll = async () => {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/process_payment`)
      .then((response) => response.json())
      .then((response) => {
        setTotal(response.recaudado)
      })
      .catch((error) => console.error('Error:', error))
  }
  return { getAll }
}
