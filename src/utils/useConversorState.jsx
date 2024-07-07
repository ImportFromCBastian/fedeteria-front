export const getState = (state) => {
  switch (true) {
    case state == null:
      return 'En sugerencia'
    case state == 0:
      return 'trueque rechazado'
    case state == 1:
      return 'trueque aceptado'
    case state == 3:
      return 'trueque por realizar'
    case state == 5:
      return 'trueque cancelado'
    default:
      return ''
  }
}
