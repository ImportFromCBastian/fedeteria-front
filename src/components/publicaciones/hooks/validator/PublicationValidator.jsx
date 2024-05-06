import * as y from 'yup'

const publicationSchema = y.object({
  //nombre validations
  nombre: y.string().required('El nombre es obligatorio'),
  //producto a cambio validations
  producto_a_cambio: y.string(),
  //descripcion validations
  descripcion: y.string().required('La descripcion es obligatoria'),
  //estado validations
  estado: y
    .string()
    .transform((value) => (value === 'true' ? 'si' : 'no'))
    .required()
})

export default publicationSchema
