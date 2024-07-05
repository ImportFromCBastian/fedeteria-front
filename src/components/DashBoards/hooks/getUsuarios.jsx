export const getUsuarios = (setUsers) => {
  const fetchUsers = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data[0].count)
      })
      .catch((error) => console.error(error))
    return response
  }

  return { fetchUsers }
}
