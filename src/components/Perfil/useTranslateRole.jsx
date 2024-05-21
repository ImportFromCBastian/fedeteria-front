export const useTranslateRole = (role) => {
  let translate
  if (role === 'cliente') {
    translate = 'client'
  }
  if (role === 'empleado') {
    translate = 'worker'
  }
  if (role === 'administrador') {
    translate = 'admin'
  }
  return translate
}
