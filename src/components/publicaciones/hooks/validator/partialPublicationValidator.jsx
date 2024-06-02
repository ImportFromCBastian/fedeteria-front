import * as y from 'yup'

const partialPublicationSchema = y.object({
  //validacion de nombre de la publicacion
  nombre: y.string().optional(),
  //validacion del precio
  precio: y.number().min(0).optional(),
  //validacion de la descripcion
  descripcion: y.string().optional(),
  //validacion de la descripcion
  estado: y.string().optional(),
  //validacion del producto a cambio
  productoACambio: y.string().optional()
})

export default partialPublicationSchema
