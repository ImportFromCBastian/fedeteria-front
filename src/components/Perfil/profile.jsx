import { useNavigate } from 'react-router-dom'

export const ShowProfile = ({ userData }) => {
  const navigate = useNavigate()
  const formatFechaNacimiento = (fechaNacimiento) => {
    if (!fechaNacimiento) return '' // Manejo de caso en que la fecha no esté definida

    const fecha = new Date(fechaNacimiento)
    const dia = fecha.getDate().toString().padStart(2, '0')
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const anio = fecha.getFullYear()

    return `${dia}/${mes}/${anio}`
  }
  const handleLogout = () => {
    // Borra el token del local storage
    localStorage.removeItem('token')
    navigate('/')
    window.location.reload()
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {userData && (
        <div
          className="bg-card text-card-foreground flex min-h-[400px] w-full max-w-5xl flex-col rounded-lg border-2 border-fede-main  bg-fede-secundary p-6 shadow-sm"
          data-v0-t="card"
        >
          <div className="flex-none">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="my-3 text-5xl font-bold leading-none tracking-tight">
                  ¡Hola, <span className="text-fede-main">{userData.nombre}</span>!
                </h3>
                <p className="text-muted-foreground text-2xl">Estos son los datos de tu perfil</p>
              </div>
              <button
                onClick={() => {
                  navigate(`/mi_perfil/editar_perfil/${userData.DNI}`)
                }}
                className="focus:ring-ring ml-auto inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
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
                  className="h-5 w-5 text-fede-main"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  <path d="m15 5 4 4"></path>
                </svg>
                <span className="sr-only">Editar perfil</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-2 p-6">
            {' '}
            {/* Ajustado justify-between */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-16">
              <div className="space-y-2">
                <label
                  className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="name"
                >
                  Nombre
                </label>
                <div className="text-xl font-bold">{userData.nombre}</div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="lastName"
                >
                  Apellido
                </label>
                <div className="text-xl font-bold">{userData.apellido}</div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email"
                >
                  Correo electrónico
                </label>
                <div className="text-xl font-bold">{userData.mail}</div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="dni"
                >
                  DNI
                </label>
                <div className="text-xl font-bold">{userData.DNI}</div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="birthDate"
                >
                  Fecha de nacimiento
                </label>
                <div className="text-xl font-bold">
                  {formatFechaNacimiento(userData.fechaNacimiento)}
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="branch"
                >
                  Sucursal más cercana
                </label>
                <div className="text-xl font-bold">
                  {userData.idLocal === 'Admin' ? 'Admin' : userData.nombreSucursal}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleLogout}
                className="my-6 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
