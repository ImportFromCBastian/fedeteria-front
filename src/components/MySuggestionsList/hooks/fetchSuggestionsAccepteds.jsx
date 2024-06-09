import { tokenFunction } from './gatherToken'

export async function fetchSuggestionsAccepteds(setSuggestions, navigate) {
  const { gatherToken } = tokenFunction(navigate)
  const token = await gatherToken()
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/accepteds/${token.DNI}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => new Error(err))
  setSuggestions(result)
}
