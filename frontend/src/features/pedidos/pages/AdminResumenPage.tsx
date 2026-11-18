import EstadoError from '../../../shared/components/EstadoError'
import Skeleton from '../../../shared/components/Skeleton'
import { formatoPrecio } from '../../../shared/utils/formato'
import TarjetaResumen from '../components/TarjetaResumen'
import { useResumenPedidos } from '../hooks/useResumenPedidos'

function AdminResumenPage() {
  const { data: resumen, isPending, isError, error } = useResumenPedidos()

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Resumen</h1>

      {isPending && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}

      {isError && <EstadoError error={error} />}

      {resumen && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TarjetaResumen titulo="Pedidos de hoy" valor={resumen.pedidos_hoy} />
          <TarjetaResumen titulo="Ingresos (pedidos entregados)" valor={formatoPrecio(resumen.ingresos_entregados)} />
          <TarjetaResumen titulo="Pendientes" valor={resumen.pendientes} />
          <TarjetaResumen titulo="En preparación" valor={resumen.en_preparacion} />
          <TarjetaResumen titulo="Entregados" valor={resumen.entregados} />
          <TarjetaResumen titulo="Cancelados" valor={resumen.cancelados} />
        </div>
      )}
    </section>
  )
}

export default AdminResumenPage