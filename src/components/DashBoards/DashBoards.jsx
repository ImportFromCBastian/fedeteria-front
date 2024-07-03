import { BarChart, DonutChart } from '@tremor/react'
import { Card, Metric, Text } from '@tremor/react'
import { DatePicker, DateRangePicker } from '@tremor/react'
import { getSucursalesConTrueques } from './hooks/getSucursalesConTrueques'
import { getUsuarios } from './hooks/getUsuarios.jsx'
import { getClientesPorSucursal } from './hooks/getClientesPorSucursal.jsx'
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

  const dataFormatter = (number) => Intl.NumberFormat('us').format(number).toString()
  const { fetchSucursalesConTrueques } = getSucursalesConTrueques(setData, setDisplay, setDisplay2)
  const { fetchUsers } = getUsuarios(setUsers)
  const { fetchClients } = getClientesPorSucursal(setClients)
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
      // fetchClients() no nada me dice que la ruta no existe! /user/client quiero hacer el get
    }
    fetchData()
  }, [])
  return (
    // <div className="flex min-h-screen items-center justify-center bg-blue-500 bg-opacity-50">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="mx-auto max-w-xl p-4" decoration="top" decorationColor="indigo">
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
      <Card className="mx-auto max-w-xs p-4" decoration="top" decorationColor="indigo">
        <Text className="mb-4 text-center font-bold">Cantidad de Trueques por Sucursal</Text>
        <DonutChart
          data={data}
          category="CantidadDeTrueques"
          index="nombre"
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
      <Card className="mx-auto max-w-xl p-4" decoration="top" decorationColor="indigo">
        <Text className="mb-4 text-center font-bold">Cantidad de Usuarios en la Plataforma</Text>
        <DonutChart
          data={users}
          index="DNI"
          category="count"
          valueFormatter={dataFormatter}
          colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
          showAnimation={true}
        />
      </Card>
    </div>
    // </div>
  )
}
