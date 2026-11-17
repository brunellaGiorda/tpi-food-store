import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { Usuario } from '../../auth/types/auth'

export const listarUsuarios = () => axiosInstance.get<Usuario[]>('/admin/usuarios').then((r) => r.data)

export const activarUsuario = (id: number) =>
  axiosInstance.post<Usuario>(`/admin/usuarios/${id}/activar`).then((r) => r.data)

export const desactivarUsuario = (id: number) =>
  axiosInstance.post<Usuario>(`/admin/usuarios/${id}/desactivar`).then((r) => r.data)