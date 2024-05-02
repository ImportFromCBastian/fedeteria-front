import { toast } from 'sonner'

export const useHandler = (credentials, setCredentials) => {
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }
  const handleChangePasswordVisibility = (e) => {
    e.preventDefault()
    setCredentials({
      ...credentials,
      showPassword: !credentials.showPassword
    })
  }

  const handleChangeCheck = (e) => {
    setCredentials({
      ...credentials,
      newsletter: e.target.checked
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    const charset = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=']
    const capitalLetters = /[A-Z]/g

    if (isNaN(parseInt(credentials.dni))) toast.error('El dni debe ser un numero')
    if (credentials.name === '') toast.error('El nombre no puede estar vacio')
    if (credentials.lastName === '') toast.error('El apellido no puede estar vacio')
    if (credentials.email === '') toast.error('El mail no puede estar vacio')
    if (credentials.password === '') {
      toast.error('La contraseña no puede estar vacia')
    } else {
      if (credentials.password.length < 6)
        toast.error('La contraseña debe tener al menos 6 caracteres')
      if (!containsSpecialChar(credentials.password, charset))
        toast.error('La contraseña debe tener al menos un caracter especial')
      if (!credentials.password.match(capitalLetters))
        toast.error('La contraseña debe tener al menos una letra mayuscula')
    }
    //TODO: Add validation for birthdate + send data to backend
  }

  const containsSpecialChar = (password, charset) => {
    for (let i = 0; i < charset.length; i++) {
      if (password.includes(charset[i])) {
        return true
      }
    }
    return false
  }
  return {
    handleChange,
    handleChangePasswordVisibility,
    handleChangeCheck,
    handleSubmit
  }
}
