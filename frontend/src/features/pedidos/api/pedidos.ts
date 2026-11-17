import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { FiltrosPedidos, Pedido, PedidoInput, PedidosPaginados } from '../types/pedido'

export const crearPedido = (datos: PedidoInput) => axiosInstance.post<Pedido>('/pedidos', datos).then((r) => r.data)

// El back devuelve los pedidos propios (o todos, si es admin), del más nuevo al más viejo
export const listarPedidos = (filtros: FiltrosPedidos) =>
  axiosInstance.get<PedidosPaginados>('/pedidos', { params: filtros }).then((r) => r.data)

export const cancelarPedido = (id: number) => axiosInstance.patch<Pedido>(`/pedidos/${id}/cancelar`).then((r) => r.data)
