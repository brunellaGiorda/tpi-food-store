import { NavLink } from 'react-router-dom'

// El link de la página actual se ve subrayado
const estiloLink = ({ isActive }: { isActive: boolean }) => (isActive ? 'underline' : 'text-gray-300 hover:text-white')

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="mx-auto flex max-w-5xl items-center gap-6 p-4">
        <span className="font-bold">Food Store</span>
        <NavLink to="/" end className={estiloLink}>Catálogo</NavLink>
        <NavLink to="/carrito" className={estiloLink}>Carrito</NavLink>
        <div className="ml-auto">
          <NavLink to="/login" className={estiloLink}>Ingresar</NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar