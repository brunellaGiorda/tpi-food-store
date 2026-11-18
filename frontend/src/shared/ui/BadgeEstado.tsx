import type { EstadoPedido } from '../../features/pedidos/types/pedido'

// Color y texto de cada estado del pedido
const estilos: Record<EstadoPedido, { texto: string; clases: string }> = {
  PENDIENTE: { texto: 'Pendiente', clases: 'bg-yellow-100 text-yellow-800' },
  EN_PREPARACION: { texto: 'En preparación', clases: 'bg-blue-100 text-blue-800' },
  ENTREGADO: { texto: 'Entregado', clases: 'bg-green-100 text-green-800' },
  CANCELADO: { texto: 'Cancelado', clases: 'bg-stone-200 text-stone-700' },
}

function BadgeEstado({ estado }: { estado: EstadoPedido }) {
  const { texto, clases } = estilos[estado]
  return <span className={`rounded px-2 py-0.5 text-xs font-medium ${clases}`}>{texto}</span>
}

export default BadgeEstado