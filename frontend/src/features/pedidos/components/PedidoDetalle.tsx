import { useState, type ReactNode } from 'react'
import BadgeEstado from '../../../shared/ui/BadgeEstado'
import Card from '../../../shared/ui/Card'
import { formatoFecha, formatoPrecio } from '../../../shared/utils/formato'
import type { Pedido } from '../types/pedido'

interface PedidoDetalleProps {
  pedido: Pedido
  // Botones que se muestran abajo (por ejemplo, Cancelar)
  acciones?: ReactNode
}

// Resumen del pedido; con "Ver detalle" se despliegan las líneas y los datos de entrega
function PedidoDetalle({ pedido, acciones }: PedidoDetalleProps) {
  const [abierto, setAbierto] = useState(false)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-semibold text-gray-800">Pedido #{pedido.id}</span>
        <BadgeEstado estado={pedido.estado} />
        <span className="text-sm text-gray-500">{formatoFecha(pedido.created_at)}</span>
        <span className="ml-auto font-bold text-gray-800">{formatoPrecio(pedido.total)}</span>
      </div>

      {abierto && (
        <div className="flex flex-col gap-2 border-t border-gray-200 pt-3 text-sm">
          {pedido.items.map((item) => (
            <div key={item.producto_id} className="flex justify-between">
              <span>
                {item.cantidad} × {item.nombre_producto} ({formatoPrecio(item.precio_unitario)} c/u)
              </span>
              <span>{formatoPrecio(item.subtotal)}</span>
            </div>
          ))}
          <p className="text-gray-600">Dirección: {pedido.direccion_entrega}</p>
          <p className="text-gray-600">Forma de pago: {pedido.forma_pago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'}</p>
          {pedido.notas && <p className="text-gray-600">Notas: {pedido.notas}</p>}
        </div>
      )}

      <div className="flex items-center gap-4 text-sm">
        <button type="button" className="text-sky-600 hover:underline" onClick={() => setAbierto(!abierto)}>
          {abierto ? 'Ocultar detalle' : 'Ver detalle'}
        </button>
        {acciones}
      </div>
    </Card>
  )
}

export default PedidoDetalle