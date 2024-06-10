import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSuggestionsAccepteds } from './hooks/fetchSuggestionsAccepteds'
import { fetchData } from '../user/hooks/fetchData.jsx'
import { SuggestAccept } from './SuggestAccept'
import { fetchAvailableTimes } from './hooks/fetchAvailableTimes.jsx'
import { useRegisterDetails } from './hooks/useRegisterDetails.jsx'
import { toast, Toaster } from 'sonner'

export const RegisterDetails = () => {
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])
  const [sucursales, setSucursales] = useState([])
  const [selectedSuggestion, setSelectedSuggestion] = useState('')
  const [selectedSucursal, setSelectedSucursal] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [availableTimes, setAvailableTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState('')
  const { fetchSucursal } = fetchData()
  const isAllOptionsSelected =
    selectedSuggestion !== '' &&
    selectedSucursal !== '' &&
    selectedDay !== '' &&
    selectedTime !== ''

  const wrapper = async () => {
    const sucursales = await fetchSucursal()
    setSucursales(sucursales)
  }

  const generateTimes = () => {
    const times = []
    let start = new Date()
    start.setHours(7, 30, 0, 0) // 7:30 a.m.
    const end = new Date()
    end.setHours(19, 0, 0, 0) // 7:00 p.m.

    while (start <= end) {
      const hours = start.getHours().toString().padStart(2, '0')
      const minutes = start.getMinutes().toString().padStart(2, '0')
      times.push(`${hours}:${minutes}`)
      start.setMinutes(start.getMinutes() + 30)
    }

    return times
  }
  const decodeToken = async (token) => {
    return await fetch(`${import.meta.env.VITE_BASE_URL}/user/decode_token`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => data.data)
      .catch((e) => new Error(e))
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null) {
      navigate('/')
      return
    }

    const fetchData = async () => {
      const decodedToken = await decodeToken(token)
      if (!decodedToken.rol) {
        navigate('/')
        return
      }
      fetchSuggestionsAccepteds(setSuggestions, navigate)
      wrapper()
    }
    fetchData()
  }, [navigate])

  const handleSuggestionSelect = (event) => {
    setSelectedSuggestion(event.target.value)
    // Clear subsequent selections when a new suggestion is selected
    setSelectedSucursal('')
    setSelectedDay('')
    setAvailableTimes([])
    setSelectedTime('')
  }

  const handleSucursalSelect = (event) => {
    setSelectedSucursal(event.target.value)
    // Clear subsequent selections when a new sucursal is selected
    setSelectedDay('')
    setAvailableTimes([])
    setSelectedTime('')
  }

  const handleDaySelect = async (event) => {
    const day = event.target.value
    setSelectedDay(day)
    if (selectedSucursal && day) {
      const times = await fetchAvailableTimes(selectedSucursal, day) //cosigo los horarios en uso
      const usedTimes = times.map((timeObj) => timeObj.hora) //los convierto en objetos de hora
      const allTimes = generateTimes() //genero la lista de todos los horarios
      const availableTimes = allTimes.filter((time) => {
        // Convertir el formato del horario actual para hacer una comparación más precisa
        const formattedTime = time + ':00'
        return !usedTimes.includes(formattedTime)
      })
      setAvailableTimes(availableTimes)
    } else {
      setAvailableTimes([])
    }
    setSelectedTime('')
  }

  const handleTimeSelect = (event) => {
    setSelectedTime(event.target.value)
  }
  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth() + 1).toString().padStart(2, '0')
    const day = today.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleAccept = (id) => {
    const data = {
      selectedSucursal,
      selectedDay,
      selectedTime
    }
    useRegisterDetails(data, id)
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-6 pt-8 md:px-6">
      <Toaster />
      <h2 className="pl-6 pt-4 text-3xl font-bold tracking-tighter md:text-4xl">
        Listado de tus trueques aceptados
      </h2>
      <p className="pl-6 pt-2 text-gray-500 md:text-xl/relaxed">
        Acá podes asignarle a tus trueques en qué sucursal, horario y día realizar el intercambio.
      </p>
      <div className="space-y-4 py-1 pl-6">
        {suggestions.length === 0 ? (
          <p>No tenés trueques aceptados!</p>
        ) : (
          <div>
            <label
              htmlFor="suggestion"
              className="mb-2 block text-sm font-medium text-fede-texto-base"
            >
              Publicación
            </label>
            <select
              name="suggestion"
              value={selectedSuggestion}
              onChange={handleSuggestionSelect}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
            >
              <option value="">Selecciona una publicación</option>
              {suggestions.map((suggestion, index) => (
                <SuggestAccept
                  key={index}
                  mainPublicationID={suggestion.productoDeseado}
                  publicationCount={suggestion.countPublication}
                  exchangeID={suggestion.idTrueque}
                />
              ))}
            </select>
          </div>
        )}

        {selectedSuggestion && (
          <div>
            <label
              htmlFor="sucursal"
              className="mb-2 block text-sm font-medium text-fede-texto-base"
            >
              Sucursal
            </label>
            <select
              name="sucursal"
              value={selectedSucursal}
              onChange={handleSucursalSelect}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
            >
              <option value="">Selecciona una sucursal</option>
              {sucursales.map((sucursal) => (
                <option className="text-black" key={sucursal.idLocal} value={sucursal.idLocal}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedSucursal && (
          <div>
            <div>
              <label htmlFor="date" className="mb-2 block text-sm font-medium text-fede-texto-base">
                Dia
              </label>
              <input
                name="date"
                value={selectedDay}
                onChange={handleDaySelect}
                className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
                type="date"
                min={getCurrentDate()} // Agregar el atributo min
              />
            </div>
          </div>
        )}

        {selectedDay && (
          <div>
            <label htmlFor="time" className="mb-2 block text-sm font-medium text-fede-texto-base">
              Horario
            </label>
            <select
              name="time"
              value={selectedTime}
              onChange={handleTimeSelect}
              className="w-full rounded-md border border-gray-300 bg-fede-fondo-texto px-3 py-2 text-fede-texto-input shadow-sm focus:border-fede-main focus:outline-none focus:ring-2 focus:ring-fede-main"
            >
              <option value="">Selecciona un horario</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        )}
        {isAllOptionsSelected && (
          <button
            onClick={() => handleAccept(selectedSuggestion)}
            className="ring-offset-background focus-visible:ring-ring border-input bg-background inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors hover:scale-105 hover:bg-green-500 hover:text-white focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Aceptar
          </button>
        )}
      </div>
    </section>
  )
}
