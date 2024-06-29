export const fetchExchangeUtils = (setProducts) => {
  const fetchProducts = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/product`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
  }

  return { fetchProducts }
}
