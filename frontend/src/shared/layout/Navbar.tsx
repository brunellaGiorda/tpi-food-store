import { useQueryClient } from '@tanstack/react-query'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

// El link de la página actual se ve subrayado
const estiloLink = ({ isActive }: { isActive: boolean }) => (isActive ? 'underline' : 'text-gray-300 hover:text-white')

function Navbar() {
  const usuario = useAuthStore((state) => state.usuario)
  const logout = useAuthStore((state) => state.logout)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  async function cerrarSesion() {
    await logout()
    queryClient.clear() // borra los datos en caché, para que no los vea el próximo usuario
    navigate('/login')
  }

  return (
    <nav className="bg-gray-800 text-white">
      <div className="mx-auto flex max-w-5xl items-center gap-6 p-4">
        <span className="font-bold">Food Store</span>
        <NavLink to="/" end className={estiloLink}>Catálogo</NavLink>
        <NavLink to="/carrito" className={estiloLink}>Carrito</NavLink>

        <div className="ml-auto flex items-center gap-4 text-sm">
          {usuario ? (
            <>
              <span>
                {usuario.full_name} <span className="rounded bg-gray-600 px-2 py-0.5 text-xs">{usuario.role}</span>
              </span>
              <button type="button" className="rounded bg-gray-600 px-3 py-1 hover:bg-gray-500" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink to="/login" className={estiloLink}>Ingresar</NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar