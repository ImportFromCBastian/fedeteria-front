export async function fetchAvailableTimes(selectedSucursal, day) {
  const result = await fetch(
    `${import.meta.env.VITE_BASE_URL}/exchange/availableTimes/${selectedSucursal}/${day}`
  )
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => new Error(err))
  return result
}
