import React, { useState } from 'react'
import { toast, Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const Sucursales = ({ sucursal, onDelete }) => {
  return (
    <div>
      <Toaster />
      <div className="rounded-lg bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <h3 className="mb-2 text-lg font-medium">{sucursal.nombre}</h3>
        <p className="text-sm text-gray-600">
          {sucursal.calle} {sucursal.numero}
        </p>
        {typeof sucursal.piso === 'string' && (
          <p className="text-sm text-gray-600">Piso: {sucursal.piso}</p>
        )}
        {typeof sucursal.depto === 'string' && (
          <p className="text-sm text-gray-600">Depto: {sucursal.depto}</p>
        )}
        <div className="mt-4 flex items-center justify-end space-x-2">
          <button
            onClick={onDelete}
            className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Eliminar
            <span className="material-symbols-outlined pl-1.5">close</span>
          </button>
        </div>
      </div>
    </div>
  )
}
