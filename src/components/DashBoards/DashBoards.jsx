import { BarChart, DonutChart } from '@tremor/react'
import { RiRecordCircleFill, RiAccountCircleLine } from '@remixicon/react'
// import { DatePicker, DateRangePicker } from '@tremor/react'
import { Badge, BadgeDelta } from '@tremor/react'
import { Card, Metric, Text } from '@tremor/react'
import { DatePicker, DateRangePicker } from '@tremor/react'
import { getSucursalesConTrueques } from './hooks/getSucursalesConTrueques'
import { getUsuarios } from './hooks/getUsuarios.jsx'
import { getClientesPorSucursal } from './hooks/getClientesPorSucursal.jsx'
import { getGanancias } from './hooks/getGanancias.jsx'
import { useEffect, useState } from 'react'
import { decodeToken } from '../../utils/tokenUtils'
import { useNavigate } from 'react-router-dom'

export const DashBoards = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [users, setUsers] = useState([])
  const [clients, setClients] = useState([])
  const [display, setDisplay] = useState()
  const [display2, setDisplay2] = useState()
  const [ganancias, setGanancias] = useState([])
  const [dataSave, setDataSave] = useState([])
  const [gananciasSave, setGananciasSave] = useState([])

  const dataFormatter = (number) => Intl.NumberFormat('us').format(number).toString()
  const { fetchSucursalesConTrueques } = getSucursalesConTrueques(
    setData,
    setDisplay,
    setDisplay2,
    setDataSave
  )
  const { fetchUsers } = getUsuarios(setUsers)
  const { fetchClients } = getClientesPorSucursal(setClients)
  const { fetchGanancias } = getGanancias(setGanancias, setGananciasSave)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null) {
      navigate('/')
      return
    }
    const fetchData = async () => {
      const result = await decodeToken(token)
      if (result.rol !== 'administrador') {
        navigate('/')
        return
      }
      fetchSucursalesConTrueques()
      fetchUsers()
      fetchClients()
      fetchGanancias()
    }
    fetchData()
  }, [])
  return (
    // <div className="flex min-h-screen items-center justify-center bg-blue-500 bg-opacity-50">
    <div className="mx-auto grid max-w-6xl gap-4 bg-white">
      {/* Fila de Trueques */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4 md:col-span-2" decoration="top" decorationColor="indigo">
          <Text className="mb-4 text-center font-bold">Cantidad de Trueques por Sucursal</Text>
          <BarChart
            data={data}
            index="nombre"
            categories={['CantidadDeTrueques']}
            colors={['yellow']}
            valueFormatter={dataFormatter}
            yAxisWidth={48}
            showAnimation={true}
            onValueChange={(v) => console.log(v)}
          />
        </Card>
        <Card className="p-4 md:h-64 md:w-64" decoration="top" decorationColor="indigo">
          <Text className="mb-4 text-center font-bold">Cantidad de Trueques por Sucursal</Text>
          <DonutChart
            data={data}
            category="CantidadDeTrueques"
            index="nombre"
            variant="donut"
            valueFormatter={dataFormatter}
            colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
            showAnimation={true}
            label={`${display}`}
            onValueChange={(v) => {
              if (v == null) {
                setDisplay(display2)
                return
              }
              setDisplay(v.CantidadDeTrueques)
            }}
          />
        </Card>
      </div>
      {/* Fila de Clientes y Usuarios */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4 md:col-span-2" decoration="top" decorationColor="indigo">
          <Badge icon={RiAccountCircleLine} size="md">
            Usuarios Totales {users}
          </Badge>
          <Text className="mb-4 text-center font-bold">Cantidad de Clientes por Sucursal</Text>
          <BarChart
            data={clients}
            index="nombre"
            categories={['Clientes']}
            colors={['yellow']}
            valueFormatter={dataFormatter}
            yAxisWidth={42}
            showAnimation={true}
            onValueChange={(v) => console.log(v)}
          />
        </Card>
        <div className="mx-auto max-w-md space-y-3">
          <p className="pt-6 text-center font-mono text-sm text-slate-500">Date Range Picker</p>
          <DateRangePicker
            className="mx-auto max-w-md"
            onValueChange={(value) => {
              const { from, to } = value
              if (from === undefined || to === undefined) return
              const filterData = dataSave.filter((item) => {
                const fecha = item.fecha.split('T')[0].split('-')
                console.log(fecha)
                return (
                  from.getDate() <= fecha[2] &&
                  from.getMonth() + 1 <= fecha[1] &&
                  from.getFullYear() <= fecha[0] &&
                  to.getDate() >= fecha[2] &&
                  to.getMonth() + 1 >= fecha[1] &&
                  to.getFullYear() >= fecha[0]
                )
              })
              setData(filterData)
              const filterGanancias = gananciasSave.filter((item) => {
                const fecha = item.fecha
                return (
                  from.getDate() <= fecha[2] &&
                  from.getMonth() + 1 <= fecha[1] &&
                  from.getFullYear() <= fecha[0] &&
                  to.getDate() >= fecha[2] &&
                  to.getMonth() + 1 >= fecha[1] &&
                  to.getFullYear() >= fecha[0]
                )
              })
              setGanancias(filterGanancias)
            }}
          />
          <button
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => {
              setData(dataSave)
              setGanancias(gananciasSave)
            }}
          >
            Eliminar filtros
          </button>
        </div>
      </div>
      {/* Fila de Ganancias Totales por Sucursales */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4 md:col-span-2" decoration="top" decorationColor="indigo">
          <Text className="mb-4 text-center font-bold">Total Recaudado por Dia por Sucursal</Text>
          <BarChart
            data={ganancias}
            index="nombreLocal"
            categories={['gananciasTotales']}
            colors={['yellow']}
            valueFormatter={dataFormatter}
            yAxisWidth={55}
            showAnimation={true}
            onValueChange={(v) => console.log(v)}
          />
        </Card>
        <Card className="p-4 md:h-64 md:w-64" decoration="top" decorationColor="indigo">
          <Text className="mb-4 text-center font-bold">Ganancia Recaudada por Sucursal</Text>
          <DonutChart
            data={ganancias}
            index="nombreLocal"
            variant="donut"
            category="gananciasTotales"
            valueFormatter={dataFormatter}
            colors={[
              'blue',
              'cyan',
              'indigo',
              'violet',
              'fuchsia',
              'blue',
              'cyan',
              'indigo',
              'violet',
              'fuchsia',
              'blue',
              'cyan',
              'indigo',
              'violet',
              'fuchsia',
              'blue',
              'cyan',
              'indigo',
              'violet',
              'fuchsia',
              'blue',
              'cyan',
              'indigo',
              'violet',
              'fuchsia'
            ]}
            showAnimation={true}
          />
        </Card>
      </div>
    </div>

    // </div>
  )
}
