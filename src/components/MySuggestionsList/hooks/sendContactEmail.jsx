export async function sendContactEmail(DNIOwner, DNISuggestor) {
  const owner = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${DNIOwner}`)
    .then((res) => res.json())
    .then((data) => data[0].mail)

  const suggestor = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${DNISuggestor}`)
    .then((res) => res.json())
    .then((data) => data[0].mail)

  const result = await fetch(`${import.meta.env.VITE_BASE_URL}/mailing/exchange/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ owner, suggestor })
  })
    .then((res) => res.json())
    .then((data) => {
      return data
    })

  return result
}
