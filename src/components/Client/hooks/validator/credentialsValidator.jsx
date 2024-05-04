import * as y from 'yup'

const clientSchema = y.object({
  //dni validations
  dni: y.number('El DNI debe ser un número').required('El DNI es requerido'),
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
    .datetime()
    .test('adultValidation', 'La persona debe ser mayor de edad.', (date) => {
      const today = new Date()
      const birthday = new Date(date)
      const age = today.getFullYear() - birthday.getFullYear()
      if (age === 18) {
        // Si la persona tiene 18 años, comprobamos si su mes y día de nacimiento ya han pasado en el año actual
        const isAdult =
          today.getMonth() > birthday.getMonth() ||
          (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate())
        return isAdult
      }
      return age > 18
    })
    .required('La fecha de nacimiento es requerida'),
  notification: y
    .string()
    .transform((value) => (value === 'true' ? 'si' : 'no'))
    .required()
})

export default clientSchema
