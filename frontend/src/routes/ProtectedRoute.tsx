import { Navigate, Outlet } from 'react-router-dom'
import type { Rol } from '../features/auth/types/auth'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  // Sin roles alcanza con tener sesión
  roles?: Rol[]
}

// Decide si muestra la página (Outlet) o redirige
function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const usuario = useAuthStore((state) => state.usuario)
  const cargando = useAuthStore((state) => state.cargando)

  // Mientras /auth/me confirma la sesión no se decide nada
  if (cargando) {
    return <p className="text-center text-gray-500">Verificando sesión...</p>
  }
  // Sin sesión: al login
  if (!usuario) {
    return <Navigate to="/login" replace />
  }
  // Con sesión pero sin el rol necesario
  if (roles && !roles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  return <Outlet />
}

export default ProtectedRoute