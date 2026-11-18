import { useQueryClient } from '@tanstack/react-query'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'

// El link de la página actual se ve subrayado
const estiloLink = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold underline underline-offset-4' : 'text-orange-100 hover:text-white'

function Navbar() {
  const usuario = useAuthStore((state) => state.usuario)
  const logout = useAuthStore((state) => state.logout)
  // Suma de las cantidades, para ver que se agregó algo al carrito
  const cantidadEnCarrito = useCartStore((state) => state.items.reduce((suma, i) => suma + i.cantidad, 0))
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  // "Panel" queda marcado en cualquier pantalla del admin, no solo en el resumen
  const enPanel = useLocation().pathname.startsWith('/admin')

  async function cerrarSesion() {
    await logout()
    queryClient.clear() // borra los datos en caché, para que no los vea el próximo usuario
    navigate('/login')
  }

  return (
    <nav className="bg-orange-900 text-white">
      {/* flex-wrap: en pantallas chicas los links pasan a la línea de abajo en vez de salirse */}
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 p-4">
        <span className="text-lg font-bold">Food Store</span>
        <NavLink to="/" end className={estiloLink}>Catálogo</NavLink>
        <NavLink to="/carrito" className={estiloLink}>Carrito ({cantidadEnCarrito})</NavLink>
        {usuario && <NavLink to="/mis-pedidos" className={estiloLink}>Mis pedidos</NavLink>}
        {/* El panel solo se muestra al admin (igual el back controla el rol) */}
        {usuario?.role === 'admin' && (
          <NavLink to="/admin/resumen" className={() => estiloLink({ isActive: enPanel })}>Panel</NavLink>
        )}

        <div className="ml-auto flex items-center gap-4 text-sm">
          {usuario ? (
            <>
              <span>
                {usuario.full_name} <span className="rounded bg-orange-800 px-2 py-0.5 text-xs">{usuario.role}</span>
              </span>
              <button type="button" className="rounded bg-orange-800 px-3 py-1 hover:bg-orange-700" onClick={cerrarSesion}>
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