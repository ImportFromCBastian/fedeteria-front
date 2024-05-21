import * as y from 'yup'

const sucursalSchema = y.object({
  nombre: y.string().required('El nombre es requerido'),
  calle: y.string().required('La calle es requerida'),
  numero: y.string().required('El número es requerido'),
  piso: y.number().optional(),
  depto: y.string().optional()
})

export default sucursalSchema
