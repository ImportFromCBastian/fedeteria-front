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
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm  "
          name="code"
          placeholder="Ingresar el código"
          onChange={childChange}
        />
      </div>
      <button className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-fede-main/75 px-4 py-2 text-sm font-medium transition-colors hover:bg-fede-main  ">
        Confirmar
      </button>
    </form>
  )
}
