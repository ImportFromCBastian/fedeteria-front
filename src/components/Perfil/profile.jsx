export const ShowProfile = ({ userData }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div
        className="bg-card text-card-foreground w-full max-w-2xl rounded-lg border shadow-sm"
        data-v0-t="card"
      >
        <div className="flex flex-col space-y-2 p-6">
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
            Hola, {userData.nombre}!
          </h3>
          <p className="text-muted-foreground text-sm">Estos son los datos de tu perfil</p>
          <button className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground ml-auto inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
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
              className="h-5 w-5"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            <span className="sr-only">Editar perfil</span>
          </button>
        </div>
        <div className="space-y-2 p-6">
          {' '}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="name"
              >
                Nombre
              </label>
              <div className="font-medium">{userData.nombre}</div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="lastName"
              >
                Apellido
              </label>
              <div className="font-medium">{userData.apellido}</div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <div className="font-medium">{userData.mail}</div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="dni"
              >
                DNI
              </label>
              <div className="font-medium">{userData.dni}</div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="birthDate"
              >
                Fecha de nacimiento
              </label>
              <div className="font-medium">{userData.fechaNacimiento}</div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="branch"
              >
                Sucursal más cercana
              </label>
              <div className="font-medium">Sucursal 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
