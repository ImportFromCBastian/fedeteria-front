import { useState } from 'react'
export const showProfile = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    dni: '',
    name: '',
    lastName: '',
    email: '',
    password: '',
    birthdate: '',
    notification: false
  })
  const { handleChange, handleChangePasswordVisibility, handleChangeCheck, handleSubmit } =
    useHandler(credentials, setCredentials, showPassword, setShowPassword)

  return (
    <div
      class="bg-card text-card-foreground w-full max-w-2xl rounded-lg border shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
          Hola, Juan Pérez!
        </h3>
        <p class="text-muted-foreground text-sm">Estos son los datos de tu perfil</p>
        <button class="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground ml-auto inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
            <path d="m15 5 4 4"></path>
          </svg>
          <span class="sr-only">Editar perfil</span>
        </button>
      </div>
      <div class="space-y-4 p-6">
        <div class="flex items-center gap-4">
          <span class="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <img class="aspect-square h-full w-full" alt="Juan Pérez" src="/placeholder-user.jpg" />
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="name"
            >
              Nombre
            </label>
            <div class="font-medium">Juan Pérez</div>
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="lastName"
            >
              Apellido
            </label>
            <div class="font-medium">Pérez</div>
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="email"
            >
              Correo electrónico
            </label>
            <div class="font-medium">juan.perez@example.com</div>
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="dni"
            >
              DNI
            </label>
            <div class="font-medium">12345678</div>
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="birthDate"
            >
              Fecha de nacimiento
            </label>
            <div class="font-medium">01/01/1990</div>
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="branch"
            >
              Sucursal más cercana
            </label>
            <div class="font-medium">Sucursal 1</div>
          </div>
        </div>
      </div>
    </div>
  )
}
