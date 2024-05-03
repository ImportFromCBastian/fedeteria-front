import { toast } from 'sonner'

export const credentialsValidator = (credentials) => {
  const containsSpecialChar = (password, charset) => {
    for (let i = 0; i < charset.length; i++) {
      if (password.includes(charset[i])) {
        return true
      }
    }
    return false
  }
  let errors = 0

  credentials.notification = credentials.notification === true ? 'si' : 'no'

  const charset = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=']

  const capitalLetters = /[A-Z]/g

  //DNI validation
  if (credentials.dni === '') {
    toast.error('El DNI no puede estar vacio')
    errors++
  } else {
    if (isNaN(parseInt(credentials.dni))) {
      toast.error('El dni debe ser un numero')
      errors++
    }
  }
  //Name validation
  if (credentials.name === '') {
    toast.error('El nombre no puede estar vacio')
    errors++
  }

  //Last name validation
  if (credentials.lastName === '') {
    toast.error('El apellido no puede estar vacio')
    errors++
  }
  //Mail validation
  if (credentials.email === '') {
    toast.error('El mail no puede estar vacio')
    errors++
  }
  //Password validation
  if (credentials.password === '') {
    toast.error('La contraseña no puede estar vacia')
    errors++
  } else {
    if (credentials.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      errors++
    }

    if (!containsSpecialChar(credentials.password, charset)) {
      toast.error('La contraseña debe tener al menos un caracter especial')
      errors++
    }

    if (!credentials.password.match(capitalLetters)) {
      toast.error('La contraseña debe tener al menos una letra mayuscula')
      errors++
    }
  }
  //Birthdate validation
  const clientBirthdate = {
    year: parseInt(credentials.birthdate.split('-')[0]),
    month: parseInt(credentials.birthdate.split('-')[1]),
    day: parseInt(credentials.birthdate.split('-')[2])
  }
  const currentYear = new Date()
  const difference = currentYear.getFullYear() - clientBirthdate.year

  if (difference < 18) {
    toast.error('Debes ser mayor de edad')
    errors++
  } else {
    if (difference === 18) {
      const currentMonth = currentYear.getMonth() + 1
      const monthDifference = clientBirthdate.month - currentMonth

      if (monthDifference < 0) {
        toast.error('Debes ser mayor de edad')
        errors++
      } else {
        if (monthDifference === 0) {
          const currentDay = currentYear.getDate()
          const dayDifference = clientBirthdate.day - currentDay
          if (dayDifference > 0) {
            toast.error('Debes ser mayor de edad')
            errors++
          }
        }
      }
    }
  }
  //return credentials validated if no error
  return [credentials, errors]
}
