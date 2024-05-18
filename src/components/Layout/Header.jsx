import { Link } from 'react-router-dom'
export const Header = () => {
  return (
    <div>
      <div className="relative w-full bg-fede-main">
        <div className="  absolute  left-1/2 top-0 mt-4 flex w-full max-w-2xl -translate-x-1/2 items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
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
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full flex-1 rounded-md border border-none bg-transparent px-3 py-2 text-base outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Buscar productos..."
            type="search"
            style={{
              boxShadow: '0 0 0 0px #2563EB'
            }}
          />
        </div>
      </div>
      <header className=" flex flex-col items-center justify-between bg-fede-main px-4 py-4 shadow-sm">
        <div className=" mt-4 flex w-full items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold" href="#">
            <img
              alt="Logo"
              className="mx-auto h-auto max-h-8 w-auto max-w-[100%]"
              src="/Fedeteria_Horizontal.svg"
            />
          </Link>
          <div className="flex items-center gap-4">
            <button className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
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
                className="h-6 w-6"
              >
                <line x1="8" x2="21" y1="6" y2="6"></line>
                <line x1="8" x2="21" y1="12" y2="12"></line>
                <line x1="8" x2="21" y1="18" y2="18"></line>
                <line x1="3" x2="3.01" y1="6" y2="6"></line>
                <line x1="3" x2="3.01" y1="12" y2="12"></line>
                <line x1="3" x2="3.01" y1="18" y2="18"></line>
              </svg>
              <span className="sr-only">Carrito</span>
            </button>
            <button className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
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
                className="h-6 w-6"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="sr-only">Perfil</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            className="font-medium underline-offset-4 hover:underline"
            to="/listado_publicaciones"
          >
            Publicaciones
          </Link>
          <Link
            className="font-medium underline-offset-4 hover:underline"
            to="/agregar_publicacion"
          >
            Cargar Publicacion
          </Link>
          <a className="font-medium underline-offset-4 hover:underline" href="#">
            Trueques futuros
          </a>
          <a className="font-medium underline-offset-4 hover:underline" href="#">
            Historial de trueques
          </a>
        </div>
      </header>
    </div>
  )
}
