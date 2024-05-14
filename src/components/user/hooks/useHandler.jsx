import userSchema from './validator/credentialsValidator'
import { toast } from 'sonner'
import { createUser } from './createUser'

export const useHandler = (credentials, setCredentials, showPassword, setShowPassword, type) => {
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
      const user = userSchema.validateSync(credentials, { abortEarly: false })
      createUser(user, type)
    } catch (error) {
      const { errors } = error
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
      return
    }
  }

  return {
    handleChange,
    handleChangePasswordVisibility,
    handleChangeCheck,
    handleSubmit
  }
}
