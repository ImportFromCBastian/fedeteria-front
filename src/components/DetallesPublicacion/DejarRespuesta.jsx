import React, { useState } from 'react'
import { useHandlerRespuesta } from './hooks/useHandlerRespuesta'

export const RespuestaForm = ({
  idConsulta,
  maxLength,
  dniDueno,
  dniConsultador,
  nombrePublicacion
}) => {
  function autoResize() {
    const textarea = document.getElementById('consulta')
    textarea.style.height = 'auto' // Resetear la altura
    textarea.style.height = textarea.scrollHeight + 'px' // Asignar la nueva altura
  }

  const [respuesta, setRespuesta] = useState('')

  const handleInputChange = (event) => {
    const text = event.target.value
    setRespuesta(text)
  }

  const { handleSubmit } = useHandlerRespuesta(
    respuesta,
    idConsulta,
    dniDueno,
    dniConsultador,
    nombrePublicacion
  )

  const handleSubmitWithValidation = async (event) => {
    event.preventDefault()
    if (respuesta.trim() !== '') {
      try {
        await handleSubmit(event)
        setTimeout(() => {
          window.location.reload()
        }, 1000) // 1 segundo de espera
      } catch (error) {
        console.error('Error al crear respuesta:', error)
      }
    }
  }

  return (
    <div className="grid gap-2">
      <label
        className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="respuesta"
      >
        Respuesta
      </label>
      <textarea
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border bg-fede-fondo-texto px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        id="consulta"
        placeholder="Escribe tu comentario aquí"
        value={respuesta}
        maxLength={maxLength}
        onChange={handleInputChange}
        onInput={autoResize}
        style={{ resize: 'none' }}
      ></textarea>
      <div className="text-sm text-gray-500">
        {respuesta.length}/{maxLength}
      </div>
      <button
        className="active:bg-primary/80 focus:ring-primary inline-flex items-center justify-center rounded-lg bg-fede-main px-4 py-2 text-sm font-medium text-white shadow-lg hover:scale-100 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleSubmitWithValidation}
        disabled={respuesta.trim() === ''}
      >
        Enviar respuesta
      </button>
    </div>
  )
}
