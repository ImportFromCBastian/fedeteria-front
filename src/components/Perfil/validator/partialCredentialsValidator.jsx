import * as y from 'yup'

const partialUserSchema = y.object({
  //firstName validations
  name: y.string().optional(),
  //lastName validations
  lastName: y.string().optional(),
  //sucursal validations
  sucursal: y.number('Selecciona una sucursal antes de registrarte').optional()
})

export default partialUserSchema
