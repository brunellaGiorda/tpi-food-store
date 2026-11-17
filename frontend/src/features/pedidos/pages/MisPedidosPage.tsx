import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import EstadoError from '../../../shared/components/EstadoError'
import EstadoVacio from '../../../shared/components/EstadoVacio'
import Paginacion from '../../../shared/components/Paginacion'
import Skeleton from '../../../shared/components/Skeleton'
import PedidoDetalle from '../components/PedidoDetalle'
import { useCancelarPedido } from '../hooks/useCancelarPedido'
import { usePedidos } from '../hooks/usePedidos'
import type { Pedido } from '../types/pedido'

const PEDIDOS_POR_PAGINA = 5

function MisPedidosPage() {
  const [pagina, setPagina] = useState(0)
  const { data, isPending, isError, error } = usePedidos({
    skip: pagina * PEDIDOS_POR_PAGINA,
    limit: PEDIDOS_POR_PAGINA,
  })
  const cancelar = useCancelarPedido()

  const totalPaginas = data ? Math.ceil(data.total / PEDIDOS_POR_PAGINA) : 0

  function confirmarCancelar(pedido: Pedido) {
    if (window.confirm(`¿Cancelar el pedido #${pedido.id}?`)) {
      cancelar.mutate(pedido.id)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Mis pedidos</h1>

      {cancelar.isError && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{handleApiError(cancelar.error)}</p>
      )}

      {isPending && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      )}

      {isError && <EstadoError error={error} />}

      {data && data.items.length === 0 && <EstadoVacio mensaje="Todavía no hiciste ningún pedido" />}

      {data && data.items.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {data.items.map((pedido) => (
              <PedidoDetalle
                key={pedido.id}
                pedido={pedido}
                acciones={
                  // Solo se puede cancelar un pedido pendiente (RN-04)
                  pedido.estado === 'PENDIENTE' && (
                    <button
                      type="button"
                      className="text-red-600 hover:underline disabled:opacity-50"
                      disabled={cancelar.isPending}
                      onClick={() => confirmarCancelar(pedido)}
                    >
                      Cancelar pedido
                    </button>
                  )
                }
              />
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}
    </section>
  )
}

export default MisPedidosPage
