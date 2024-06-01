import { useNavigate } from 'react-router-dom'
export const Publication = ({ publication }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/ver_publicacion/' + publication.idPublicacion)
  }
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
      <span onClick={handleClick} className="absolute inset-0 z-10" href="#">
        <span className="sr-only">View</span>
      </span>
      <img
        src="Fedeteria_Solo_Logo.svg"
        alt="Item 1"
        width="300"
        height="300"
        className="aspect-square h-64 w-full object-cover"
      />
      <div className="bg-white p-4 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{publication.nombre}</h3>
          <span className="text-sm font-medium text-gray-500 ">I</span>
        </div>
        <p className="text-sm text-gray-500 ">{publication.estado}</p>
      </div>
    </div>
  )
}
