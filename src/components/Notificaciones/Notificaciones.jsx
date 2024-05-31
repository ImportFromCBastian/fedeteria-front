import React, { useEffect, useState, useRef } from 'react'
import { Notificacion } from './notificacion'

export default function Notificaciones() {
  const [isOpen, setIsOpen] = useState(false)
  const [notificaciones, setNotificaciones] = useState([])
  const [hayNuevas, setHayNuevas] = useState(false)
  const notificationsRef = useRef(null)

  const decodeToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        method: 'POST'
      })
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error decoding token:', error)
      throw new Error('Error decoding token')
    }
  }

  const toggleNotifications = async () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHayNuevas(false)
      const token = localStorage.getItem('token')
      try {
        const decodedToken = await decodeToken(token)
        if (decodedToken) {
          await fetch(
            `${import.meta.env.VITE_BASE_URL}/notificaciones/marcar_vistas/${decodedToken.DNI}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
        }
      } catch (error) {
        console.error('Error toggling notifications:', error)
      }
    }
  }

  const fetchNotificaciones = async () => {
    const token = localStorage.getItem('token')
    try {
      const decodedToken = await decodeToken(token)
      if (decodedToken) {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/notificaciones/${decodedToken.DNI}`
        )
        const data = await response.json()
        setNotificaciones(data.data)
        if (data.data.some((not) => not.nueva === 'si')) {
          setHayNuevas(true)
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  useEffect(() => {
    fetchNotificaciones()
    const interval = setInterval(fetchNotificaciones, 5000)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      clearInterval(interval)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClickOutside = (event) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  const eliminarNotificacion = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/notificaciones/eliminar/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (!response.ok) {
        throw new Error(response.statusText || 'Error al eliminar notificación')
      }
      fetchNotificaciones()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  return (
    <div className="relative" ref={notificationsRef}>
      <button
        onClick={toggleNotifications}
        aria-label="Toggle Notifications"
        className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {hayNuevas && (
          <span className="absolute right-1 top-1 inline-flex h-3 w-3 rounded-full bg-red-600"></span>
        )}
        <svg
          className="h-6 w-6 text-black transition-colors hover:text-gray-900"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-5 z-50 max-h-[350px] w-[400px] rounded-lg border-2 border-fede-main bg-fede-secundary shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-1">
            <h3 className="text-lg font-medium">Notificaciones</h3>
            <button
              onClick={toggleNotifications}
              aria-label="Close Notifications"
              className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
                className="h-5 w-5"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div className="max-h-[250px] w-[400px] space-y-4 overflow-y-auto p-4">
            {notificaciones.length === 0 ? (
              <p>No hay notificaciones</p>
            ) : (
              notificaciones.map((not, index) => (
                <div key={index} className="mb-4">
                  <Notificacion
                    tipo={not.tipo}
                    idNotificacion={not.idNotificacion}
                    contenido={not.contenido}
                    onDelete={() => eliminarNotificacion(not.idNotificacion)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
