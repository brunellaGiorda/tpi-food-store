export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO'

export type FormaPago = 'EFECTIVO' | 'TRANSFERENCIA'

// Línea del pedido tal como la devuelve el backend (DetallePedidoRead)
export interface DetallePedido {
  producto_id: number
  nombre_producto: string
  precio_unitario: number
  cantidad: number
  subtotal: number
}

// Pedido tal como lo devuelve el backend (PedidoRead)
export interface Pedido {
  id: number
  usuario_id: number
  estado: EstadoPedido
  forma_pago: FormaPago
  direccion_entrega: string
  notas: string | null
  total: number
  created_at: string
  updated_at: string
  items: DetallePedido[]
}

// Respuesta de GET /pedidos (PedidosPaginados)
export interface PedidosPaginados {
  total: number
  items: Pedido[]
}

// Parámetros que acepta GET /pedidos
export interface FiltrosPedidos {
  skip: number
  limit: number
  estado?: EstadoPedido
}

// Lo que se manda en POST /pedidos (PedidoCreate)
export interface PedidoInput {
  items: { producto_id: number; cantidad: number }[]
  forma_pago: FormaPago
  direccion_entrega: string
  notas: string | null
}