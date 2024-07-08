import { BarChart, DonutChart } from '@tremor/react'
import { RiAccountCircleLine } from '@remixicon/react'
import { Badge } from '@tremor/react'
import { Card, Text } from '@tremor/react'
import { DateRangePicker } from '@tremor/react'
import { getSucursalesConTrueques } from './hooks/getSucursalesConTrueques'
import { getUsuarios } from './hooks/getUsuarios.jsx'
import { getClientesPorSucursal } from './hooks/getClientesPorSucursal.jsx'
import { getGanancias } from './hooks/getGanancias.jsx'
import { useEffect, useState } from 'react'
import { decodeToken } from '../../utils/tokenUtils'
import { useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { getCantidadDeTruequesPorSucursal } from './hooks/getCantidadDeTruequesPorSucursal'
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
  const [cantidadDeTrueques, setCantidadDeTrueques] = useState([])

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
  const { fetchCantidadDeTruequesPorSucursal } =
    getCantidadDeTruequesPorSucursal(setCantidadDeTrueques)
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
      fetchCantidadDeTruequesPorSucursal()
    }
    fetchData()
  }, [])
  return (
    <div className=" flex items-center justify-center">
      <div className=" my-5 w-full max-w-[86rem] rounded-lg border-2 border-fede-main bg-fede-secundary p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-fede-texto-base">
          Analíticas de tus ferreterías
        </h2>
        <div className="mx-auto grid max-w-6xl gap-4">
          <Toaster expand="true" richColors="true" />
          <div className=" mb-6 gap-4 md:grid-cols-3">
            <Card className="p-4 md:col-span-2" decoration="top" decorationColor="fede-main">
              <Text className="mb-4 text-center font-bold">Cantidad de Trueques por Sucursal</Text>
              <BarChart
                data={cantidadDeTrueques}
                index="nombre"
                categories={['CantidadDeTrueques']}
                colors={['yellow']}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
                showAnimation={true}
                onValueChange={(v) => console.log()}
              />
            </Card>
          </div>
          <div className="mb-6 grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Card className="p-4 md:col-span-3" decoration="top" decorationColor="fede-main">
              <Text className="mb-4 text-center font-bold">Cantidad de Trueques por Día</Text>
              <BarChart
                data={data}
                index="fechaAux"
                categories={['CantidadDeTrueques']}
                colors={['yellow']}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
                showAnimation={true}
                onValueChange={(v) => console.log()}
              />
            </Card>
            <div className="flex items-center justify-end">
              <Card className=" p-4 md:h-64 md:w-64 " decoration="top" decorationColor="fede-main ">
                <Text className="mb-4 text-center font-bold">Cantidad de Trueques por Día</Text>
                <DonutChart
                  data={data}
                  category="CantidadDeTrueques"
                  index="fechaAux"
                  variant="donut"
                  valueFormatter={dataFormatter}
                  colors={[
                    'yellow',
                    'orange',
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
          </div>
          {/* Fila de Clientes y Usuarios */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className=" p-4 md:col-span-3" decoration="top" decorationColor="fede-main">
              <Badge icon={RiAccountCircleLine} size="md" color={'yellow'}>
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
                onValueChange={(v) => console.log()}
              />
            </Card>
            <div className=" mx-auto mb-6 max-w-xs space-y-3">
              <p className="pt-6 text-center font-mono text-sm text-slate-500">
                Seleccione rango de fechas
              </p>
              <DateRangePicker
                className="mx-auto max-w-md"
                selectPlaceholder="Seleccionar"
                placeholder="Seleccionar rango de fechas"
                onValueChange={(value) => {
                  const { from, to } = value
                  if (from === undefined || to === undefined) return
                  const filterData = dataSave.filter((item) => {
                    const fecha = item.fechaDate
                    return from <= fecha && fecha <= to
                  })
                  if (filterData.length === 0) {
                    toast.error('No hay datos de trueques en el rango de fechas')
                  }
                  setData(filterData)
                  const filterGanancias = gananciasSave.filter((item) => {
                    const fecha = item.fechaDate
                    return from <= fecha && fecha <= to
                  })
                  if (filterGanancias.length === 0) {
                    toast.error('No hay datos de ganancias en el rango de fechas')
                  }
                  setGanancias(filterGanancias)
                }}
              />
              <div className="flex justify-end">
                <button
                  className="mt-4 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => {
                    setData(dataSave)
                    setGanancias(gananciasSave)
                  }}
                >
                  Eliminar filtros
                </button>
              </div>
            </div>
          </div>
          {/* Fila de Ganancias Totales por Sucursales */}

          <div className=" grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Card className="p-4 md:col-span-3" decoration="top" decorationColor="fede-main">
              <Text className="mb-4 text-center font-bold">Total Recaudado por Dia </Text>
              <BarChart
                data={ganancias}
                index="fecha"
                categories={['gananciasTotales']}
                colors={['yellow']}
                valueFormatter={dataFormatter}
                yAxisWidth={55}
                showAnimation={true}
                onValueChange={(v) => console.log()}
              />
            </Card>
            <div className="flex items-center justify-end">
              <Card className="p-4 md:h-64 md:w-64" decoration="top" decorationColor="fede-main">
                <Text className="mb-4 text-center font-bold">Total Recaudado por Dia</Text>
                <DonutChart
                  data={ganancias}
                  index="fecha"
                  variant="donut"
                  category="gananciasTotales"
                  valueFormatter={dataFormatter}
                  colors={[
                    'yellow',
                    'orange',
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
        </div>
      </div>
    </div>
  )
}
