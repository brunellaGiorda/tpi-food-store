import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { Pedido, PedidoInput } from '../types/pedido'

export const crearPedido = (datos: PedidoInput) => axiosInstance.post<Pedido>('/pedidos', datos).then((r) => r.data)