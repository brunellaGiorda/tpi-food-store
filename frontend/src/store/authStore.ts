import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '../features/auth/api/auth'
import type { LoginInput, Usuario, UsuarioSesion } from '../features/auth/types/auth'

interface AuthState {
  usuario: UsuarioSesion | null
  // true mientras checkSession confirma la sesión al abrir la app
  cargando: boolean
  login: (datos: LoginInput) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  limpiarSesion: () => void
}

// Del usuario del backend se guardan solo nombre, email y rol
const aUsuarioSesion = ({ username, full_name, email, role }: Usuario): UsuarioSesion => ({
  username,
  full_name,
  email,
  role,
})

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      // POST /auth/token deja la cookie; después /auth/me trae los datos del usuario.
      // Si las credenciales están mal, el error sigue de largo y lo muestra LoginPage.
      login: async (datos) => {
        await authApi.login(datos)
        const usuario = await authApi.obtenerUsuarioActual()
        set({ usuario: aUsuarioSesion(usuario) })
      },

      // Aunque falle la petición, el store se limpia igual
      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          set({ usuario: null })
        }
      },

      // Al abrir la app: si la cookie sigue siendo válida, /auth/me devuelve el usuario
      checkSession: async () => {
        set({ cargando: true })
        try {
          const usuario = await authApi.obtenerUsuarioActual()
          set({ usuario: aUsuarioSesion(usuario) })
        } catch {
          set({ usuario: null })
        } finally {
          set({ cargando: false })
        }
      },

      // La usa el interceptor de Axios cuando la sesión ya no es válida
      limpiarSesion: () => set({ usuario: null }),
    }),
    {
      name: 'auth',
      // Solo se guarda el usuario (nunca el token, que está en la cookie HttpOnly)
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)