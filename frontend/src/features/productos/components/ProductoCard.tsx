import { useState } from 'react'
import { useCartStore } from '../../../store/cartStore'
import Button from '../../../shared/ui/Button'
import Card from '../../../shared/ui/Card'
import { formatoPrecio } from '../../../shared/utils/formato'
import type { Producto } from '../types/producto'

function ProductoCard({ producto }: { producto: Producto }) {
  const agregar = useCartStore((state) => state.agregar)
  const [agregado, setAgregado] = useState(false)
  const sePuedeComprar = producto.disponible && producto.stock > 0

  // Agrega el producto y el botón dice "¡Agregado!" por un segundo
  function agregarAlCarrito() {
    agregar({ producto_id: producto.id, nombre: producto.nombre, precio_unitario: producto.precio_base })
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1000)
  }

  return (
    <Card className="flex flex-col gap-2">
      {producto.imagen_url ? (
        <img src={producto.imagen_url} alt={producto.nombre} className="h-36 w-full rounded object-cover" />
      ) : (
        <div className="flex h-36 items-center justify-center rounded bg-stone-100 text-sm text-stone-400">Sin imagen</div>
      )}

      <span className="text-xs uppercase text-orange-700">{producto.categoria.nombre}</span>
      <h2 className="font-semibold text-stone-800">{producto.nombre}</h2>
      {producto.descripcion && <p className="text-sm text-stone-600">{producto.descripcion}</p>}

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-lg font-bold text-stone-800">{formatoPrecio(producto.precio_base)}</span>
        {!sePuedeComprar && <span className="text-xs text-red-600">No disponible</span>}
      </div>

      <Button type="button" disabled={!sePuedeComprar} onClick={agregarAlCarrito}>
        {agregado ? '¡Agregado!' : 'Agregar al carrito'}
      </Button>
    </Card>
  )
}

export default ProductoCard