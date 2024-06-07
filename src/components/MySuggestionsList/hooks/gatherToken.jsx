export const tokenFunction = (navigate) => {
  const gatherToken = async () => {
    const localToken = localStorage.getItem('token')
    if (localToken === null) {
      navigate('/')
      return
    }
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
      headers: {
        Authorization: `Bearer ${localToken}`
      },
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => data.data)
      .catch((e) => new Error(e))
  }

  return { gatherToken }
}
