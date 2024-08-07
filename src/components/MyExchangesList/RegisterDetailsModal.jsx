import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchData } from '../user/hooks/fetchData.jsx'
import { fetchAvailableTimes } from '../MySuggestionsList/hooks/fetchAvailableTimes.jsx'
import { toast, Toaster } from 'sonner'
import { decodeToken } from '../../utils/tokenUtils.js'
import { fetchSucursalById } from './hooks/fetchSucursal.jsx'
import dateSchema from '../MySuggestionsList/hooks/validator/dateSchema.jsx'
import { useRegisterDetails } from '../MySuggestionsList/hooks/useRegisterDetails.jsx'

export const RegisterDetailsModal = ({
  exchangeID,
  nombrePublicacion,
  publicationCount,
  nombreOfrecida,
  DNIOwner,
  DNISuggestor
}) => {
  const navigate = useNavigate()

  const [sucursales, setSucursales] = useState([])
  const [selectedSuggestion, setSelectedSuggestion] = useState('')
  const [selectedSucursal, setSelectedSucursal] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [availableTimes, setAvailableTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [suggestorEmail, setSuggestorEmail] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [suggestorName, setSuggestorName] = useState('')
  const [sucursal, setSucursal] = useState('')

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

  const sendMail = async (dia, mes, hora, sucursal, codigo) => {
    try {
      const mailResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/mailing/codigo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          owner: ownerEmail,
          suggestor: suggestorEmail,
          ownerName: ownerName,
          suggestorName: suggestorName,
          dia,
          mes,
          hora,
          sucursal,
          codigo
        })
      })
      if (!mailResponse.ok) {
        toast.error('Error al enviar el correo de bloqueo')
      }
    } catch (error) {
      console.error('Error al enviar el correo de bloqueo', error)
      toast.error('Error al enviar el correo de bloqueo')
    }
  }

  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token === null) {
          navigate('/')
          return
        }

        const decodedToken = await decodeToken(token)
        if (!decodedToken.rol) {
          navigate('/')
          return
        }

        setSelectedSuggestion(exchangeID)
        wrapper()

        // Obtener datos del owner
        const ownerResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/${DNIOwner[0].DNI}`
        )
        const ownerData = await ownerResponse.json()
        setOwnerEmail(ownerData[0].mail)
        setOwnerName(ownerData[0].nombre)

        // Obtener datos del suggestor
        const suggestorResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/${DNISuggestor[0].DNI}`
        )
        const suggestorData = await suggestorResponse.json()
        setSuggestorEmail(suggestorData[0].mail)
        setSuggestorName(suggestorData[0].nombre)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [navigate, exchangeID, DNIOwner, DNISuggestor])

  const handleSucursalSelect = (event) => {
    setSelectedSucursal(event.target.value)
    setSelectedDay('')
    setAvailableTimes([])
    setSelectedTime('')
  }

  const handleDaySelect = async (event) => {
    const day = event.target.value
    setSelectedDay(day)
    if (selectedSucursal && day) {
      const times = await fetchAvailableTimes(selectedSucursal, day)
      const usedTimes = times.map((timeObj) => timeObj.hora)
      const allTimes = generateTimes()
      const availableTimes = allTimes.filter((time) => {
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
    let day = today.getDate() + 1
    day = day.toString().padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const handleAccept = async (exchangeID) => {
    try {
      dateSchema.validateSync(selectedDay, { abortEarly: false }) // Validar que la fecha sea mayor al día actual.
    } catch (error) {
      const { errors } = error
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i])
      }
      return
    }
    const randomString = generateRandomString(6).toUpperCase() // Generar una cadena aleatoria de 10 caracteres
    try {
      const fetchedSucursal = await fetchSucursalById(selectedSucursal)
      setSucursal(fetchedSucursal.nombre)
      await sendMail(
        selectedDay.split('-')[2], // Extraer día
        getMonthName(parseInt(selectedDay.split('-')[1])), // Extraer mes
        selectedTime,
        fetchedSucursal.nombre, // Usar nombre de la sucursal obtenido
        randomString
      )
      const data = {
        selectedSucursal,
        selectedDay,
        selectedTime
      }
      useRegisterDetails(randomString, data, exchangeID)
      closeModal()
    } catch (error) {
      console.error('Error al obtener datos de la sucursal:', error)
      toast.error('Error al registrar el trueque. Inténtalo de nuevo.')
    }
  }
  const getMonthName = (monthNumber) => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ]
    return months[monthNumber - 1] // Resta 1 porque los meses en el array empiezan en 0
  }
  const closeModal = () => {
    window.location.reload()
  }

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="mx-auto w-full max-w-4xl">
        <Toaster />
        <section className="rounded-lg border-4 border-fede-main bg-white px-4 pb-6 pt-8 shadow-lg">
          <div className="absolute left-56 top-48 mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-2">
            {/* Puedes colocar otro elemento aquí si deseas */}
          </div>
          <div className="space-y-4 px-6 py-1">
            <div className="relative">
              <button
                onClick={() => closeModal()}
                className="ring-offset-background focus-visible:ring-ring border-input bg-background line-heigh absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-full border bg-red-500 pb-1 text-xl font-medium transition-colors hover:scale-105 hover:bg-red-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
              >
                &times;
              </button>
            </div>

            <h2 className="text-center text-3xl font-bold tracking-tighter md:text-4xl">
              Seleccionando detalles para la publicación:
            </h2>
            {publicationCount !== 1 ? (
              <h2 className="text-center text-3xl font-bold tracking-tighter md:text-4xl">
                {nombrePublicacion} ↔︎ {publicationCount} productos
              </h2>
            ) : (
              <h2 className="text-center text-3xl font-bold tracking-tighter md:text-4xl">
                {nombrePublicacion} ↔︎ {nombreOfrecida}
              </h2>
            )}
            <div>
              <label htmlFor="sucursal" className="block text-sm font-medium text-fede-texto-base">
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
                  <option key={sucursal.idLocal} value={sucursal.idLocal}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
            </div>

            {selectedSucursal && (
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-fede-texto-base">
                  Día
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
            )}
            {selectedDay && (
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-fede-texto-base">
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
      </div>
    </div>
  )
}
