import { tokenFunction } from './gatherToken'

export async function fetchSuggestions(setReceivedSuggestions, setGivenSuggestions, navigate) {
  const { gatherToken } = tokenFunction(navigate)
  const token = await gatherToken()
  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/${token.DNI}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => new Error(err))
  setReceivedSuggestions(result)
  const resultGiven = await fetch(`${import.meta.env.VITE_BASE_URL}/exchange/given/${token.DNI}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => new Error(err))
  setGivenSuggestions(resultGiven)
}
