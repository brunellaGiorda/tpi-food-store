import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../../store/authStore'

// Todas las peticiones del frontend usan esta instancia
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Hace que el navegador mande la cookie del login en cada petición
  withCredentials: true,
})

// En estas dos rutas un 401 no significa que se venció la sesión:
// en /auth/token es una contraseña incorrecta y en /auth/me es que todavía no hay nadie logueado
const RUTAS_SIN_LIMPIEZA = ['/auth/token', '/auth/me']

// Si la sesión venció o la cuenta fue desactivada, se borra el usuario del store
// y ProtectedRoute lo manda al login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown }>) => {
    const url = error.config?.url ?? ''
    const status = error.response?.status
    const detail = error.response?.data?.detail
    const sesionVencida = status === 401 && !RUTAS_SIN_LIMPIEZA.includes(url)
    const cuentaDesactivada = status === 400 && detail === 'Cuenta de usuario desactivada'
    if (sesionVencida || cuentaDesactivada) {
      useAuthStore.getState().limpiarSesion()
    }
    return Promise.reject(error)
  },
)