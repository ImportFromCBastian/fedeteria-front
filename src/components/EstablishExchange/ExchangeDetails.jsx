export const ExchangeDetails = ({ childAccept, childCancel }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="mx-4 my-5 w-full max-w-6xl rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md">
        <div className="grid grid-cols-[2fr_0fr_2fr] gap-2 lg:gap-6">
          <div className="grid items-start gap-4 md:gap-10">
            <div className="items-start md:flex">
              <div className="grid gap-4">
                <h1 className=" text-3xl font-bold">Tu producto</h1>
                <div className="flex items-center gap-4">
                  {/* {mainProductFotoUrl ? (
                  <img
                    src={mainProductFotoUrl}
                    alt="Producto a Intercambiar"
                    width="300"
                    height="300"
                    className="aspect-square overflow-hidden rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="mr-4 flex aspect-square h-72 w-72 items-center justify-center rounded-lg bg-gray-200 text-xs">
                    Cargando...
                  </div>
                )} */}
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Nombre</h3>
                    <p className="text-sm text-gray-500">Descripcion</p>
                    <p className="text-sm text-gray-500">Categoria:</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-gray-500"
            >
              <path d="M8 3L4 7l4 4"></path>
              <path d="M4 7h16"></path>
              <path d="m16 21 4-4-4-4"></path>
              <path d="M20 17H4"></path>
            </svg>
          </div>
          <div className="grid gap-4">
            <h1 className="text-3xl font-bold">Productos ofrecidos por</h1>
            <div className="grid h-full gap-4">
              {/* {offeredProducts.map((product, index) => (
              <div
                key={index}
                onClick={() => navigate(`/ver_publicacion/${product.idPublicacion}`)}
                className={
                  'group relative flex h-full items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 '
                }
              >
                {offeredProductsFotos[index] ? (
                  <img
                    src={offeredProductsFotos[index]}
                    alt={`Producto ${product.nombre}`}
                    width="100"
                    height="100"
                    className="aspect-square overflow-hidden rounded-lg object-cover "
                  />
                ) : (
                  <div className="mr-4 flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200 text-xs">
                    Cargando...
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold">{product.nombre}</h3>
                  <p className="text-sm text-gray-500">{product.descripcion}</p>
                  <p className="text-sm text-gray-500">Categoria: {useConversor(product.precio)}</p>
                </div>
              </div>
            ))} */}
            </div>
            <button
              className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-green-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={childAccept}
            >
              Trueque realizado
            </button>
            <button
              className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={childCancel}
            >
              Trueque cancelado
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
