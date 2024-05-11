export const Publicacion = ({ publicationName, onDelete }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-2 text-lg font-medium">{publicationName}</h3>
      <div className="flex items-center justify-end space-x-2">
        <button className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:bg-green-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          Aceptar
          <span className="material-symbols-outlined pl-1.5">check</span>
        </button>
        <button
          onClick={() => onDelete()}
          className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Rechazar
          <span className="material-symbols-outlined pl-1.5">delete</span>
        </button>
      </div>
    </div>
  )
}
