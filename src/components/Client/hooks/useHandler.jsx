import clientSchema from './validator/credentialsValidator'
import { toast } from 'sonner'
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
    try {
      clientSchema.validateSync(credentials, { abortEarly: false })
    } catch (error) {
      const { errors } = error
      console.log(errors)
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
      return
    }

    createUser(credentials)
    //redirect to login page
  }

  return {
    handleChange,
    handleChangePasswordVisibility,
    handleChangeCheck,
    handleSubmit
  }
}
