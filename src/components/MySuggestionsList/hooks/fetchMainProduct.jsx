export async function fetchMainProduct(id, setMainProduct) {
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/suggestion/product/${id}}`)
    .then((res) => res.json())
    .then((data) => {
      setMainProduct(data[0])
    })
    .catch((err) => new Error(err))
  return result
}
