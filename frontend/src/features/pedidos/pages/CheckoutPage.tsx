import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import EstadoVacio from '../../../shared/components/EstadoVacio'
import Button from '../../../shared/ui/Button'
import Card from '../../../shared/ui/Card'
import Input from '../../../shared/ui/Input'
import { direccionValida } from '../../../shared/utils/validaciones'
import { useCartStore } from '../../../store/cartStore'
import { useCrearPedido } from '../hooks/useCrearPedido'
import type { FormaPago } from '../types/pedido'

const formatoPrecio = (valor: number) => `$ ${valor.toLocaleString('es-AR')}`

const valoresIniciales = {
  direccion_entrega: '',
  forma_pago: 'EFECTIVO' as FormaPago,
  notas: '',
}

function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const vaciar = useCartStore((state) => state.vaciar)
  const total = useCartStore((state) => state.total())
  const navigate = useNavigate()
  const crear = useCrearPedido()

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) =>
      crear.mutate(
        {
          // Del carrito al back solo van el producto y la cantidad: el precio lo pone el back
          items: items.map((item) => ({ producto_id: item.producto_id, cantidad: item.cantidad })),
          forma_pago: value.forma_pago,
          direccion_entrega: value.direccion_entrega,
          notas: value.notas.trim() || null,
        },
        {
          onSuccess: () => {
            navigate('/mis-pedidos')
            vaciar()
          },
        },
      ),
  })

  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Confirmar pedido</h1>
        <EstadoVacio mensaje="Tu carrito está vacío" />
        <Link to="/" className="text-center text-sky-600 hover:underline">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto flex max-w-lg flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Confirmar pedido</h1>

      {/* Resumen del carrito */}
      <Card className="flex flex-col gap-2 text-sm">
        {items.map((item) => (
          <div key={item.producto_id} className="flex justify-between">
            <span>
              {item.cantidad} × {item.nombre}
            </span>
            <span>{formatoPrecio(item.precio_unitario * item.cantidad)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
          <span>Total</span>
          <span>{formatoPrecio(total)}</span>
        </div>
      </Card>

      <Card>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.Field name="direccion_entrega" validators={{ onSubmit: direccionValida }}>
            {(field) => (
              <Input
                label="Dirección de entrega"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field name="forma_pago">
            {(field) => (
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Forma de pago</span>
                <select
                  className="rounded border border-gray-300 px-3 py-2"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as FormaPago)}
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                </select>
              </label>
            )}
          </form.Field>

          <form.Field name="notas">
            {(field) => (
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Notas (opcional)</span>
                <textarea
                  className="rounded border border-gray-300 px-3 py-2"
                  rows={2}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>

          {/* Por ejemplo, si mientras tanto se quedó sin stock algún producto */}
          {crear.isError && (
            <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{handleApiError(crear.error)}</p>
          )}

          <Button type="submit" disabled={crear.isPending}>
            {crear.isPending ? 'Enviando...' : 'Confirmar pedido'}
          </Button>
        </form>
      </Card>
    </section>
  )
}

export default CheckoutPage