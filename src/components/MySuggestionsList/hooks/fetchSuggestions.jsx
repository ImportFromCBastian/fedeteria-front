import { tokenFunction } from './gatherToken'

export async function fetchSuggestions(setSuggestions, navigate) {
  const { gatherToken } = tokenFunction(navigate)
  const token = await gatherToken()
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/${token.DNI}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => new Error(err))
  setSuggestions(result)
}
