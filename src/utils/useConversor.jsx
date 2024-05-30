const getCategory = (price) => {
  switch (true) {
    case price <= 0:
      return '0'
    case price <= 1000:
      return 'I'
    case price <= 2500:
      return 'II'
    case price <= 5000:
      return 'III'
    case price <= 7500:
      return 'IV'
    case price <= 10000:
      return 'V'
    case price <= 20000:
      return 'VI'
    case price <= 40000:
      return 'VII'
    case price <= 70000:
      return 'VIII'
    case price <= 100000:
      return 'IX'
    default:
      return 'X'
  }
}

export default getCategory
//COMO USARLO:
// import getCategory from 'src/utils/useConversor.jsx'
//OPCIONAL: ((el anterior me funciona peeero ->)tambien puede servir ->) './src/utils\useConversor.jsx'
// luego con getCategory(publicacion.precio) (por ejemplo)  obtenemos el resultado
