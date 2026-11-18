import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { EstadoPedido, FiltrosPedidos, Pedido, PedidoInput, PedidosPaginados, ResumenPedidos } from '../types/pedido'

export const crearPedido = (datos: PedidoInput) => axiosInstance.post<Pedido>('/pedidos', datos).then((r) => r.data)

// El back devuelve los pedidos propios (o todos, si es admin), del más nuevo al más viejo
export const listarPedidos = (filtros: FiltrosPedidos) =>
  axiosInstance.get<PedidosPaginados>('/pedidos', { params: filtros }).then((r) => r.data)

export const cancelarPedido = (id: number) => axiosInstance.patch<Pedido>(`/pedidos/${id}/cancelar`).then((r) => r.data)

// Solo admin: avanza o cancela según la máquina de estados (el back valida la transición)
export const cambiarEstadoPedido = (id: number, estado: EstadoPedido) =>
  axiosInstance.patch<Pedido>(`/pedidos/${id}/estado`, { estado }).then((r) => r.data)

export const obtenerResumen =() => axiosInstance.get<ResumenPedidos>('/pedidos/resumen').then((r) => r.data)