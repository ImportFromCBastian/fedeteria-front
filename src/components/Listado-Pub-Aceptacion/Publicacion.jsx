import React, { useState } from 'react'
import { toast, Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const Publicacion = ({ publicationName, idPublicacion, onDelete, onAccept }) => {
  const [showInputModal, setShowInputModal] = useState(false)
  const [numero, setNumero] = useState('')
  const exceptThisSymbols = ['e', 'E', '+', '-', ',']
  const navigate = useNavigate()

  const handleChangeNumero = (event) => {
    if (event.target.value === '-' || event.target.value === 'e') {
      setNumero('')
    } else setNumero(event.target.value)
  }

  const handleSubmit = (e) => {
    e.stopPropagation() // Evitar la propagación del clic al contenedor principal
    // Lógica para enviar el número y el ID de la publicación al backend
    if (!isNaN(parseInt(numero))) {
      onAccept(numero)
    } else {
      toast.error('Ingrese un numero valido!')
    }
    // Cerrar la ventana flotante después de enviar el número
    setShowInputModal(false)
  }

  const handleModalClose = (e) => {
    e.stopPropagation() // Evitar la propagación del clic al contenedor principal
    // Cerrar la ventana flotante sin enviar el número
    setShowInputModal(false)
  }

  return (
    <div
      className="relative"
      onClick={() => {
        navigate('/listado_publicaciones/' + idPublicacion)
      }}
    >
      <Toaster />
      <div className="rounded-lg bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <h3 className="mb-2 text-lg font-medium">{publicationName}</h3>
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation() // Evitar la propagación del clic al contenedor principal
              setShowInputModal(true)
            }}
            className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-green-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Aceptar
            <span className="material-symbols-outlined pl-1.5">check</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation() // Evitar la propagación del clic al contenedor principal
              onDelete()
            }}
            className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Rechazar
            <span className="material-symbols-outlined pl-1.5">close</span>
          </button>
        </div>
      </div>
      {showInputModal && (
        <div
          className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center"
          onClick={(e) => e.stopPropagation()} // Evitar la propagación del clic al contenedor principal
        >
          <div
            className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-50"
            onClick={(e) => {
              e.stopPropagation() // Evitar la propagación del clic al contenedor principal
              handleModalClose(e)
            }}
          ></div>
          <div
            className="z-10 w-96 rounded-lg bg-white p-8"
            onClick={(e) => e.stopPropagation()} // Evitar la propagación del clic al contenedor principal
          >
            <h2 className="mb-4 text-lg font-semibold">Ingrese precio para la publicacion</h2>
            <input
              type="number"
              autoComplete="off"
              onChange={handleChangeNumero}
              onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
              className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="Ingrese el precio"
            />
            <div className="flex w-full justify-start space-x-4">
              <button
                onClick={handleSubmit}
                className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-green-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Enviar
                <span className="material-symbols-outlined pl-1.5">check</span>
              </button>

              <button
                onClick={handleModalClose}
                className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                style={{ marginLeft: '8px' }} // Agregar un margen izquierdo para separar los botones
              >
                Cancelar
                <span className="material-symbols-outlined pl-1.5">close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
