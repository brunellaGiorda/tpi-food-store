import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { LoginInput, MensajeRespuesta, Usuario } from '../types/auth'

// El back recibe el login como datos de formulario, no como JSON.
// URLSearchParams los arma con ese formato: username=admin&password=...
export const login = ({ username, password }: LoginInput) =>
  axiosInstance.post<MensajeRespuesta>('/auth/token', new URLSearchParams({ username, password })).then((r) => r.data)

export const obtenerUsuarioActual = () => axiosInstance.get<Usuario>('/auth/me').then((r) => r.data)

export const logout = () => axiosInstance.post<MensajeRespuesta>('/auth/logout').then((r) => r.data)