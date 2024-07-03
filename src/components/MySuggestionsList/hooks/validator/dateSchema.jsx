import * as y from 'yup'

const isFutureDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selectedDate = new Date(date)
  return selectedDate > today
}

const dateSchema = y
  .date()
  .required('La fecha es requerida')
  .test('is-future-date', 'La fecha debe ser mayor a la actual', isFutureDate)

export default dateSchema
