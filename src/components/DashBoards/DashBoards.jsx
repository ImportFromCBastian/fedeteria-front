import { BarChart, DonutChart } from '@tremor/react'
import { Card, Metric, Text } from '@tremor/react'
import { DatePicker, DateRangePicker } from '@tremor/react'
import { getSucursalesConTrueques } from './hooks/getSucursalesConTrueques'
import { useEffect, useState } from 'react'
import { decodeToken } from '../../utils/tokenUtils'
import { useNavigate } from 'react-router-dom'

export const DashBoards = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [display, setDisplay] = useState()
  const [display2, setDisplay2] = useState()

  const dataFormatter = (number) => Intl.NumberFormat('us').format(number).toString()
  const { fetchSucursalesConTrueques } = getSucursalesConTrueques(setData, setDisplay, setDisplay2)

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
    }
    fetchData()
  }, [])
  return (
    <div className=" grid-cols-2 ">
      <Card
        className="float-left mx-auto max-w-xl text-slate-50"
        decoration="top"
        decorationColor="indigo"
      >
        Cantidad de Trueques por Sucursal
        <BarChart
          data={data}
          index="nombre"
          categories={['CantidadDeTrueques']} //PONER BIEN EL NOMBRE DE LO QUE EL ARRAY TIENE Y QUE VA A USAR COMO Y EN LA GRAFICA.
          colors={['yellow']}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
          showAnimation={true}
          onValueChange={(v) => console.log(v)}
        />
      </Card>
      <Card
        className="float-left mx-auto my-auto max-w-xs text-slate-50"
        decoration="top"
        decorationColor="indigo"
      >
        Cantidad de Trueques por Sucursal
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
    </div>
  )
}
