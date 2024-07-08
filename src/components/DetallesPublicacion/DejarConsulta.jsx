import React, { useState } from 'react'
import { useHandlerConsulta } from './hooks/useHandlerConsulta'

export const ConsultaForm = ({
  consulta,
  setConsulta,
  maxLength,
  idPublicacion,
  dni,
  dniPublicacion,
  nombrePublicacion
}) => {
  function autoResize() {
    const textarea = document.getElementById('consulta')
    textarea.style.height = 'auto' // Resetear la altura
    textarea.style.height = textarea.scrollHeight + 'px' // Asignar la nueva altura
  }

  const handleInputChange = (event) => {
    const text = event.target.value
    setConsulta(text)
  }

  const { handleSubmit } = useHandlerConsulta(
    consulta,
    idPublicacion,
    dni,
    dniPublicacion,
    nombrePublicacion
  )

  const handleSubmitWithValidation = (event) => {
    event.preventDefault()
    if (consulta.trim() !== '') {
      handleSubmit(event)
    }
  }

  return (
    <div className="grid gap-2">
      <label
        className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="consulta"
      >
        Deja tu consulta
      </label>
      <textarea
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border-2 bg-fede-fondo-texto px-3 py-2 text-sm focus:border-fede-main focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50"
        id="consulta"
        placeholder="Escribe tu comentario aquí"
        value={consulta}
        maxLength={maxLength}
        onChange={handleInputChange}
        onInput={autoResize}
        style={{ resize: 'none' }}
      ></textarea>
      <div className="text-sm text-gray-500">
        {consulta.length}/{maxLength}
      </div>
      <button
        className="active:bg-primary/80 focus:ring-primary inline-flex items-center justify-center rounded-lg bg-fede-main px-4 py-2 text-sm font-medium text-white shadow-lg hover:scale-100 hover:bg-fede-hover-button focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleSubmitWithValidation}
        disabled={consulta.trim() === ''}
      >
        Enviar consulta
      </button>
    </div>
  )
}
