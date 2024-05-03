//TODO: refactor the birthday validator and error message handler
import { credentialsValidator } from './validator/credentialsValidator'
import { createUser } from './createUser'

export const useHandler = (credentials, setCredentials, showPassword, setShowPassword) => {
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }
  const handleChangePasswordVisibility = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  const handleChangeCheck = (e) => {
    setCredentials({
      ...credentials,
      notification: e.target.checked
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const [credentialsValidated, errors] = credentialsValidator(credentials)
    console.log(!errors) //to test new implementation
    // if (!errors) createUser(credentialsValidated)
  }

  return {
    handleChange,
    handleChangePasswordVisibility,
    handleChangeCheck,
    handleSubmit
  }
}
