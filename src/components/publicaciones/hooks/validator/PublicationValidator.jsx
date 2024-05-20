import * as y from 'yup'

const publicationSchema = y.object({
  //dni validations
  dni: y
    .number()
    .typeError('El DNI debe ser un numero')
    .positive('El DNI debe ser un número valido')
    .required('El DNI es requerido'),
  //nombre validations
  nombre: y.string().required('El nombre es obligatorio'),
  //producto a cambio validations
  producto_a_cambio: y.string(),
  //descripcion validations
  descripcion: y.string().required('La descripcion es obligatoria'),
  //estado validations
  estado: y.string().required('El estado es obligatorio'),
  fotos: y.array().of(y.mixed()).min(1, 'Debe agregar al menos una foto')
})

export default publicationSchema
