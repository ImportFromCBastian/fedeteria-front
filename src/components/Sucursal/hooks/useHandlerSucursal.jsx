import { toast } from 'sonner'
import { createSucursal } from './createSucursal.jsx'
import sucursalSchema from './validator/sucursalValidator.jsx'

export const useHandlerSucursal = (credentials, setCredentials) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({
      ...credentials,
      [name]: value === '' ? null : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      sucursalSchema.validateSync(credentials, { abortEarly: false })
    } catch (error) {
      const { errors } = error
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
      return
    }

    createSucursal(credentials)
    // Add redirection to login page or other appropriate action
  }

  return {
    handleChange,
    handleSubmit
  }
}
