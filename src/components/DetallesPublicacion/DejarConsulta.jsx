import React, { useState } from 'react'

export const CommentForm = ({ comment, setComment, maxLength }) => {
  function autoResize() {
    const textarea = document.getElementById('comment')
    textarea.style.height = 'auto' // Resetear la altura
    textarea.style.height = textarea.scrollHeight + 'px' // Asignar la nueva altura
  }

  const handleInputChange = (event) => {
    const text = event.target.value
    setComment(text)
  }

  return (
    <div className="grid gap-2">
      <label
        className=" text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="comment"
      >
        Deja tu consulta
      </label>
      <textarea
        className=" border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border bg-fede-fondo-texto px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        id="comment"
        placeholder="Escribe tu comentario aquí"
        value={comment}
        maxLength={maxLength}
        onChange={handleInputChange}
        onInput={autoResize}
        style={{ resize: 'none' }}
      ></textarea>
      <div className="text-sm text-gray-500">
        {comment.length}/{maxLength}
      </div>
      <button className="text-primary-foreground active:bg-primary/80 focus:ring-primary inline-flex items-center justify-center rounded-lg bg-fede-main px-8 py-3 text-sm font-medium shadow-lg hover:scale-105 hover:bg-fede-hover-button focus:outline-none focus:ring-2 focus:ring-offset-2">
        Enviar consulta
      </button>
    </div>
  )
}
