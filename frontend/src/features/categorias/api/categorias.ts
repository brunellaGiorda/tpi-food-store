import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { Categoria, CategoriaInput } from '../types/categoria'

export const listarCategorias = () => axiosInstance.get<Categoria[]>('/categorias').then((r) => r.data)

export const crearCategoria = (datos: CategoriaInput) =>
  axiosInstance.post<Categoria>('/categorias', datos).then((r) => r.data)

export const actualizarCategoria = (id: number, datos: CategoriaInput) =>
  axiosInstance.put<Categoria>(`/categorias/${id}`, datos).then((r) => r.data)

// Baja lógica: el back responde 204 sin cuerpo
export const eliminarCategoria = (id: number) => axiosInstance.delete(`/categorias/${id}`).then(() => undefined)