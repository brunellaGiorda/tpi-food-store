import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { FiltrosProductos, Producto, ProductoInput, ProductosPaginados, StockInput } from '../types/producto'

// Axios arma la query con params: /productos?skip=0&limit=6&search=pizza
export const listarProductos = (filtros: FiltrosProductos) =>
  axiosInstance.get<ProductosPaginados>('/productos', { params: filtros }).then((r) => r.data)

export const crearProducto = (datos: ProductoInput) =>
  axiosInstance.post<Producto>('/productos', datos).then((r) => r.data)

export const actualizarProducto = (id: number, datos: ProductoInput) =>
  axiosInstance.put<Producto>(`/productos/${id}`, datos).then((r) => r.data)

export const cambiarStock = (id: number, datos: StockInput) =>
  axiosInstance.patch<Producto>(`/productos/${id}/stock`, datos).then((r) => r.data)

// Baja lógica: el back responde 204 sin cuerpo
export const eliminarProducto = (id: number) => axiosInstance.delete(`/productos/${id}`).then(() => undefined)
