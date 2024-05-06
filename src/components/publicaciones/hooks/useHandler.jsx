import { toast } from 'sonner'
import { CreatePublication } from './CreatePublication'
import publicationSchema from './validator/PublicationValidator'

export const useHandler = (publicationData, setPublicationData) => {
  const handleChange = (e) => {
    setPublicationData({
      ...publicationData,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeCheck = (e) => {
    setPublicationData({
      ...publicationData,
      notification: e.target.checked
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      publicationSchema.validateSync(publicationData, { abortEarly: false })
    } catch (error) {
      const { errors } = error
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
      return
    }
    CreatePublication(publicationData)
  }

  return {
    handleChange,
    handleSubmit,
    handleChangeCheck
  }
}
