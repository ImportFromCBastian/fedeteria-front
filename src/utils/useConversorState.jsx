export const getState = (state) => {
  switch (true) {
    case state == null:
      return 'En sugerencia'
    case state == 0:
      return 'trueque no realizado'
    case state == 1:
      return 'trueque realizado'
    case state == 3:
      return 'trueque confirmado'
    default:
      return 'no se que hiciste papi'
  }
}
