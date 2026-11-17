import { Link } from 'react-router-dom'
import EstadoVacio from '../../../shared/components/EstadoVacio'
import Card from '../../../shared/ui/Card'
import { formatoPrecio } from '../../../shared/utils/formato'
import { useCartStore, type ItemCarrito } from '../../../store/cartStore'

function CarritoPage() {
  const items = useCartStore((state) => state.items)
  const quitar = useCartStore((state) => state.quitar)
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad)
  const vaciar = useCartStore((state) => state.vaciar)
  const total = useCartStore((state) => state.total())

  function confirmarQuitar(item: ItemCarrito) {
    if (window.confirm(`¿Quitar "${item.nombre}" del carrito?`)) {
      quitar(item.producto_id)
    }
  }

  function confirmarVaciar() {
    if (window.confirm('¿Vaciar el carrito?')) {
      vaciar()
    }
  }

  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Carrito</h1>
        <EstadoVacio mensaje="Tu carrito está vacío" />
        <Link to="/" className="text-center text-sky-600 hover:underline">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Carrito</h1>

      <Card className="flex flex-col divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.producto_id} className="flex flex-wrap items-center gap-4 py-3">
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.nombre}</p>
              <p className="text-sm text-gray-500">{formatoPrecio(item.precio_unitario)} c/u</p>
            </div>

            <input
              type="number"
              min={1}
              className="w-14 rounded border border-gray-300 px-2 py-1 text-sm"
              value={item.cantidad}
              onChange={(e) => cambiarCantidad(item.producto_id, Number(e.target.value))}
            />

            <span className="w-28 text-right font-medium text-gray-800">
              {formatoPrecio(item.precio_unitario * item.cantidad)}
            </span>

            <button
              type="button"
              className="text-sm text-red-600 hover:underline"
              onClick={() => confirmarQuitar(item)}
            >
              Quitar
            </button>
          </div>
        ))}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="button" className="text-sm text-gray-600 hover:underline" onClick={confirmarVaciar}>
          Vaciar carrito
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-gray-800">Total: {formatoPrecio(total)}</span>
          <Link to="/checkout" className="rounded bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700">
            Confirmar pedido
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CarritoPage