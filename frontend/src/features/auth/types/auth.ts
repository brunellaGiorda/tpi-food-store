export type Rol = 'admin' | 'user'

// Usuario tal como lo devuelve el backend (UserPublic)
export interface Usuario {
  id: number
  username: string
  full_name: string
  email: string
  role: Rol
  disabled: boolean
  created_at: string
}

// Lo que guarda el authStore: solo los datos que usa la interfaz, nunca el token
export interface UsuarioSesion {
  username: string
  full_name: string
  email: string
  role: Rol
}

export interface LoginInput {
  username: string
  password: string
}

// Respuesta de /auth/token y /auth/logout. El token no viene acá: viaja en la cookie.
export interface MensajeRespuesta {
  message: string
}
