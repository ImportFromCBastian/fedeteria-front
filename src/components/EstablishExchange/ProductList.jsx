export const ProductList = ({ index, nombre, precio, changeProductList, state }) => {
  return (
    <>
      <h3 className="font-semibold">{nombre}</h3>
      <p className="text-sm leading-none">${precio}</p>
      {state === 'toAdd' && (
        <button
          className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium transition-colors"
          onClick={() => changeProductList(index, 'add')}
        >
          Agregar a lista
        </button>
      )}
      {state === 'toShow' && (
        <button
          className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium transition-colors"
          onClick={() => changeProductList(index, 'remove')}
        >
          Eliminar producto
        </button>
      )}
    </>
  )
}
