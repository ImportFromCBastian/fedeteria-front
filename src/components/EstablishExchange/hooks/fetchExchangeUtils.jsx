export const fetchExchangeUtils = (setProducts) => {
  const fetchProducts = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/product`)
      .then((res) => res.json())
      .then((data) => {
        // Ordenar los productos alfabéticamente por nombre
        const sortedProducts = data.sort((a, b) => a.nombre.localeCompare(b.nombre))
        setProducts(sortedProducts)
      })
      .catch((err) => console.error(err))
  }

  return { fetchProducts }
}
