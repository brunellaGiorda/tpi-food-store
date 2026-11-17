import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { FiltrosProductos, ProductosPaginados } from '../types/producto'

// Axios arma la query con params: /productos?skip=0&limit=6&search=pizza
export const listarProductos = (filtros: FiltrosProductos) =>
  axiosInstance.get<ProductosPaginados>('/productos', { params: filtros }).then((r) => r.data)