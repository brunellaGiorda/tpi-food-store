import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { Categoria } from '../types/categoria'

export const listarCategorias = () => axiosInstance.get<Categoria[]>('/categorias').then((r) => r.data)