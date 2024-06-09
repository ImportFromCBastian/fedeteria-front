export async function fetchProducts(id, setOfferedProducts) {
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/suggestion/${id}}`)
    .then((res) => res.json())
    .then((data) => {
      setOfferedProducts(data)
    })
    .catch((err) => new Error(err))
  return result
}
