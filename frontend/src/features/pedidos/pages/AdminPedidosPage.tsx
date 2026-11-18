import { useState } from 'react'
import { getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { handleApiError } from '../../../shared/api/handleApiError'
import EstadoError from '../../../shared/components/EstadoError'
import Skeleton from '../../../shared/components/Skeleton'
import Tabla from '../../../shared/components/Tabla'
import BadgeEstado from '../../../shared/ui/BadgeEstado'
import { formatoFecha, formatoPrecio } from '../../../shared/utils/formato'
import { useCambiarEstadoPedido } from '../hooks/useCambiarEstadoPedido'
import { usePedidos } from '../hooks/usePedidos'
import type { EstadoPedido, Pedido } from '../types/pedido'

// A qué estado avanza cada uno. ENTREGADO y CANCELADO son finales: no avanzan.
const siguienteEstado: Partial<Record<EstadoPedido, { estado: EstadoPedido; texto: string }>> = {
  PENDIENTE: { estado: 'EN_PREPARACION', texto: 'Pasar a preparación' },
  EN_PREPARACION: { estado: 'ENTREGADO', texto: 'Marcar entregado' },
}

const opcionesFiltro: { valor: EstadoPedido | ''; texto: string }[] = [
  { valor: '', texto: 'Todos los estados' },
  { valor: 'PENDIENTE', texto: 'Pendiente' },
  { valor: 'EN_PREPARACION', texto: 'En preparación' },
  { valor: 'ENTREGADO', texto: 'Entregado' },
  { valor: 'CANCELADO', texto: 'Cancelado' },
]

const columnas: ColumnDef<Pedido>[] = [
  { accessorKey: 'id', header: 'N°', cell: ({ getValue }) => `#${getValue<number>()}` },
  { accessorKey: 'created_at', header: 'Fecha', cell: ({ getValue }) => formatoFecha(getValue<string>()) },
  { accessorKey: 'usuario_id', header: 'Cliente', cell: ({ getValue }) => `Usuario #${getValue<number>()}` },
  { accessorKey: 'estado', header: 'Estado', cell: ({ getValue }) => <BadgeEstado estado={getValue<EstadoPedido>()} /> },
  {
    accessorKey: 'forma_pago',
    header: 'Pago',
    cell: ({ getValue }) => (getValue<string>() === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'),
  },
  { accessorKey: 'total', header: 'Total', cell: ({ getValue }) => formatoPrecio(getValue<number>()) },
]

function AdminPedidosPage() {
  const [estado, setEstado] = useState<EstadoPedido | undefined>(undefined)
  // El panel pide hasta 100 pedidos (los más nuevos primero) y la tabla los pagina del lado del cliente
  const { data, isPending, isError, error } = usePedidos({ skip: 0, limit: 100, estado })
  const cambiarEstado = useCambiarEstadoPedido()

  const table = useReactTable({
    data: data?.items ?? [],
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  function avanzar(pedido: Pedido, nuevoEstado: EstadoPedido) {
    cambiarEstado.mutate({ id: pedido.id, estado: nuevoEstado })
  }

  function confirmarCancelar(pedido: Pedido) {
    if (window.confirm(`¿Cancelar el pedido #${pedido.id}? Se devuelve el stock de sus productos.`)) {
      cambiarEstado.mutate({ id: pedido.id, estado: 'CANCELADO' })
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-800">Pedidos</h1>
        <select
          className="rounded border border-stone-300 bg-white px-3 py-2 text-sm"
          value={estado ?? ''}
          onChange={(e) => setEstado((e.target.value || undefined) as EstadoPedido | undefined)}
        >
          {opcionesFiltro.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </option>
          ))}
        </select>
      </div>

      {cambiarEstado.isError && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{handleApiError(cambiarEstado.error)}</p>
      )}

      {isPending && <Skeleton className="h-48" />}

      {isError && <EstadoError error={error} />}

      {data && (
        <Tabla
          table={table}
          mensajeVacio="No hay pedidos"
          acciones={(pedido) => {
            const siguiente = siguienteEstado[pedido.estado]
            // Sin siguiente estado es ENTREGADO o CANCELADO: no se puede hacer nada
            if (!siguiente) return null
            return (
              <>
                <button
                  type="button"
                  className="font-medium text-stone-700 hover:underline disabled:opacity-50"
                  disabled={cambiarEstado.isPending}
                  onClick={() => avanzar(pedido, siguiente.estado)}
                >
                  {siguiente.texto}
                </button>
                <button
                  type="button"
                  className="text-red-600 hover:underline disabled:opacity-50"
                  disabled={cambiarEstado.isPending}
                  onClick={() => confirmarCancelar(pedido)}
                >
                  Cancelar
                </button>
              </>
            )
          }}
        />
      )}
    </section>
  )
}

export default AdminPedidosPage