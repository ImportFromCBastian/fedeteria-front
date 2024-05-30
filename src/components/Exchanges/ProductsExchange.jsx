import { useState } from 'react'
export const ProductsExchange = ({
  onChildChange,
  selectedPublication,
  setSelectedPublication,
  setFinalPrice,
  finalPrice,
  publication,
  index
}) => {
  const [style, setStyle] = useState(
    'group relative flex items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl'
  )
  const [selected, setSelected] = useState(false)
  const handleClick = () => {
    if (selected) {
      setStyle(
        'group relative flex items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl'
      )
      onChildChange(
        index,
        'remove',
        setFinalPrice,
        finalPrice,
        setSelectedPublication,
        selectedPublication
      )
    } else {
      setStyle(
        'group relative flex items-center gap-4 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl border rounded border-black'
      )
      onChildChange(index, 'add')
    }
    setSelected(!selected)
  }
  return (
    <div onClick={handleClick} className={style}>
      <img
        src="/Fedeteria_Solo_Logo.svg"
        alt="Producto 1"
        width="100"
        height="100"
        className="aspect-square overflow-hidden rounded-lg border border-gray-200 object-cover dark:border-gray-800"
      />
      <div className=" p-4 ">
        <h3 className="text-xl font-bold">{publication.nombre}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{publication.descripcion}</p>
      </div>
    </div>
  )
}
