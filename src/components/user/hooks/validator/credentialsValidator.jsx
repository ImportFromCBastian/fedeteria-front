import * as y from 'yup'

const userSchema = y.object({
  //dni validations
  dni: y
    .number()
    .typeError('El DNI debe ser un numero')
    .positive('El DNI debe ser un número valido')
    .required('El DNI es requerido'),
  //firstName validations
  name: y.string().required('El nombre es requerido'),
  //lastName validations
  lastName: y.string().required('El apellido es requerido'),
  //email validations
  email: y.string().email('El email no es válido').required('El email es requerido'),
  //password validations
  password: y
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
      'La contraseña debe tener al menos un caracter especial'
    )
    .matches(/[A-Z]/g, 'La contraseña debe tener al menos una letra mayuscula')
    .required('La contraseña es requerida'),
  //birthdate validations
  birthdate: y
    .string()
    .test('adultValidation', 'La persona debe ser mayor de edad.', (date) => {
      const today = new Date()
      const birthday = {
        getFullYear: () => parseInt(date.split('-')[0]),
        getMonth: () => parseInt(date.split('-')[1]),
        getDate: () => parseInt(date.split('-')[2])
      }
      const age = today.getFullYear() - birthday.getFullYear()
      if (age === 18) {
        // Si la persona tiene 18 años, comprobamos si su mes y día de nacimiento ya han pasado en el año actual
        const monthCorrection = today.getMonth() + 1
        const isAdult =
          monthCorrection > birthday.getMonth() ||
          (monthCorrection === birthday.getMonth() && today.getDate() >= birthday.getDate())
        return isAdult
      }
      return age > 18
    })
    .required('La fecha de nacimiento es requerida'),
  sucursal: y
    .number('Selecciona una sucursal antes de registrarte')
    .required('La sucursal es requerida'),
  notification: y.boolean().required()
})

export default userSchema
