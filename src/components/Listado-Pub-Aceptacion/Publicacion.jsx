import React, { useState } from 'react'
export const Publicacion = ({ publicationName, onDelete, onAccept }) => {
  const [showInputModal, setShowInputModal] = useState(false)
  const [numero, setNumero] = useState('')

  const handleChangeNumero = (event) => {
    setNumero(event.target.value)
  }

  const handleSubmit = () => {
    // Lógica para enviar el número y el ID de la publicación al backend
    onAccept(numero)
    // Cerrar la ventana flotante después de enviar el número
    setShowInputModal(false)
  }

  const handleModalClose = () => {
    // Cerrar la ventana flotante sin enviar el número
    setShowInputModal(false)
  }

  return (
    <div className="relative">
      <div className="rounded-lg bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <h3 className="mb-2 text-lg font-medium">{publicationName}</h3>
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => setShowInputModal(true)} // Mostrar la ventana flotante al hacer clic en Aceptar
            className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-green-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Aceptar
            <span className="material-symbols-outlined pl-1.5">check</span>
          </button>
          <button
            onClick={onDelete}
            className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Rechazar
            <span className="material-symbols-outlined pl-1.5">close</span>
          </button>
        </div>
      </div>
      {showInputModal && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
          <div className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-50"></div>
          <div className="z-10 rounded-lg bg-white p-8">
            <h2 className="mb-4 text-lg font-semibold">Ingrese un número</h2>
            <input
              type="number"
              value={numero}
              onChange={handleChangeNumero}
              className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Ingrese un número"
            />
            <button
              onClick={handleSubmit}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Enviar
            </button>
            <button onClick={handleModalClose} className="ml-2 text-gray-600 hover:text-gray-800">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
