export const ShowProfile = ({ userData }) => {
  const formatFechaNacimiento = (fechaNacimiento) => {
    if (!fechaNacimiento) return '' // Manejo de caso en que la fecha no esté definida

    const fecha = new Date(fechaNacimiento)
    const dia = fecha.getDate().toString().padStart(2, '0')
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const anio = fecha.getFullYear()

    return `${dia}/${mes}/${anio}`
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {userData && (
        <div
          className="bg-card text-card-foreground w-full max-w-2xl rounded-lg border bg-fede-secundary shadow-sm"
          data-v0-t="card"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold leading-none tracking-tight">
                  ¡Hola, <span className="text-fede-main">{userData.nombre}</span>!
                </h3>
                <p className="text-muted-foreground text-sm">Estos son los datos de tu perfil</p>
              </div>
              <button className="focus:ring-ring ml-auto inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor" // Aquí puedes cambiar "currentColor" por "text-fede-main" si has configurado Tailwind para usar el color fede-main
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-fede-main" // Usa la clase de color fede-main aquí
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  <path d="m15 5 4 4"></path>
                </svg>
                <span className="sr-only">Editar perfil</span>
              </button>
            </div>
          </div>
          <div className="space-y-2 p-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="name"
                >
                  Nombre
                </label>
                <div className="font-bold">{userData.nombre}</div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="lastName"
                >
                  Apellido
                </label>
                <div className="font-bold">{userData.apellido}</div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email"
                >
                  Correo electrónico
                </label>
                <div className="font-bold">{userData.mail}</div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="dni"
                >
                  DNI
                </label>
                <div className="font-bold">{userData.DNI}</div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="birthDate"
                >
                  Fecha de nacimiento
                </label>
                <div className="font-bold">{formatFechaNacimiento(userData.fechaNacimiento)}</div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="branch"
                >
                  Sucursal más cercana
                </label>
                <div className="font-bold">Sucursal 1</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
