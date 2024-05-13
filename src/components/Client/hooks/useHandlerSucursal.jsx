import { toast } from 'sonner'
import { createSucursal } from './createSucursal'
import sucursalSchema from './validator/sucursalValidator'

export const useHandlerSucursal = (credentials, setCredentials) => {
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
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
    //redirect to login page
  }

  return {
    handleChange,
    handleSubmit
  }
}
