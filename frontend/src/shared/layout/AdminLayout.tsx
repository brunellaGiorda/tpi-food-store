import { NavLink, Outlet } from 'react-router-dom'

// La sección actual se ve resaltada
const estiloLink = ({ isActive }: { isActive: boolean }) =>
  `rounded px-3 py-1 text-sm ${isActive ? 'bg-orange-600 text-white' : 'text-stone-700 hover:bg-stone-200'}`

// Menú para moverse entre las pantallas del admin, arriba de cada una
function AdminLayout() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex flex-wrap gap-2 rounded bg-white p-2 shadow">
        <NavLink to="/admin/resumen" className={estiloLink}>Resumen</NavLink>
        <NavLink to="/admin/categorias" className={estiloLink}>Categorías</NavLink>
        <NavLink to="/admin/productos" className={estiloLink}>Productos</NavLink>
        <NavLink to="/admin/pedidos" className={estiloLink}>Pedidos</NavLink>
        <NavLink to="/admin/usuarios" className={estiloLink}>Usuarios</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

export default AdminLayout