export const ExchangeCodeForm = ({ childSubmit, childChange }) => {
  return (
    <form className="space-y-6" onSubmit={childSubmit}>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="code"
        >
          Código del trueque
        </label>
        <input
          className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input placeholder-fede-texto-claro shadow-sm outline-fede-main focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          name="code"
          placeholder="Ingresar el código"
          onChange={childChange}
        />
      </div>
      <button className="w-full rounded-md bg-fede-main px-4 py-2 font-medium text-white hover:scale-105  hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-fede-main focus:ring-offset-2">
        Confirmar
      </button>
    </form>
  )
}
