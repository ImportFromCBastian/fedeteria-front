export const ProductSuggested = ({ product }) => {
  return (
    <div className="flex justify-between rounded-md border">
      <h1>{product.nombre}</h1>
      <h1 className="">{product.estado}</h1>
    </div>
  )
}
