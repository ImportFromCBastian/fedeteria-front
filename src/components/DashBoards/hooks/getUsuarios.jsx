export const getUsuarios = (setUsers) => {
  const fetchUsers = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
      })
      .catch((error) => console.error(error))
    return response
  }

  return { fetchUsers }
}
