import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { handleApiError } from '../../../shared/api/handleApiError'
import EstadoError from '../../../shared/components/EstadoError'
import Skeleton from '../../../shared/components/Skeleton'
import Tabla from '../../../shared/components/Tabla'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import Modal from '../../../shared/ui/Modal'
import { formatoPrecio } from '../../../shared/utils/formato'
import { categoriaElegida, obligatorio, precioValido, stockValido } from '../../../shared/utils/validaciones'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { useCambiarStock, useEliminarProducto, useGuardarProducto, useProductos } from '../hooks/useProductos'
import type { Producto } from '../types/producto'

const columnas: ColumnDef<Producto>[] = [
  { accessorKey: 'nombre', header: 'Nombre' },
  { id: 'categoria', header: 'Categoría', accessorFn: (producto) => producto.categoria.nombre },
  { accessorKey: 'precio_base', header: 'Precio', cell: ({ getValue }) => formatoPrecio(getValue<number>()) },
  { accessorKey: 'stock', header: 'Stock' },
  { accessorKey: 'disponible', header: 'Disponible', cell: ({ getValue }) => (getValue<boolean>() ? 'Sí' : 'No') },
]

const valoresVacios = {
  nombre: '',
  descripcion: '',
  precio_base: 0,
  imagen_url: '',
  categoria_id: 0, // 0 = todavía no se eligió
  stock: 0,
  disponible: true,
}

// En los campos numéricos, si se borra todo llega NaN: se muestra el campo vacío
const valorNumero = (valor: number) => (Number.isNaN(valor) ? '' : valor)

function AdminProductosPage() {
  // El panel pide hasta 100 productos y la tabla los pagina del lado del cliente
  const { data, isPending, isError, error } = useProductos({ skip: 0, limit: 100 })
  const { data: categorias = [] } = useCategorias()
  const guardar = useGuardarProducto()
  const cambiarStock = useCambiarStock()
  const eliminar = useEliminarProducto()

  // Modal de crear/editar. editando null: se está creando uno nuevo.
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  // Modal de stock: el producto al que se le cambia el stock
  const [productoStock, setProductoStock] = useState<Producto | null>(null)

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: ({ value }) =>
      guardar.mutate(
        {
          id: editando?.id,
          datos: {
            nombre: value.nombre,
            descripcion: value.descripcion.trim() || null,
            precio_base: value.precio_base,
            imagen_url: value.imagen_url.trim() || null,
            categoria_id: value.categoria_id,
            // El stock solo se carga al crear; después se cambia con el botón Stock
            ...(editando ? {} : { stock: value.stock, disponible: value.disponible }),
          },
        },
        { onSuccess: cerrarModal },
      ),
  })

  const formStock = useForm({
    defaultValues: { stock: 0, disponible: true },
    onSubmit: ({ value }) => {
      if (productoStock) {
        cambiarStock.mutate({ id: productoStock.id, datos: value }, { onSuccess: () => setProductoStock(null) })
      }
    },
  })

  const table = useReactTable({
    data: data?.items ?? [],
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  function abrirModal(producto: Producto | null) {
    setEditando(producto)
    form.reset(
      producto
        ? {
            nombre: producto.nombre,
            descripcion: producto.descripcion ?? '',
            precio_base: producto.precio_base,
            imagen_url: producto.imagen_url ?? '',
            categoria_id: producto.categoria_id,
            stock: producto.stock,
            disponible: producto.disponible,
          }
        : valoresVacios,
      { keepDefaultValues: true },
    )
    guardar.reset()
    setModalAbierto(true)
  }

  function cerrarModal() {
    setModalAbierto(false)
    setEditando(null)
  }

  function abrirStock(producto: Producto) {
    formStock.reset({ stock: producto.stock, disponible: producto.disponible }, { keepDefaultValues: true })
    cambiarStock.reset()
    setProductoStock(producto)
  }

  function confirmarEliminar(producto: Producto) {
    if (window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) {
      eliminar.mutate(producto.id)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Productos</h1>
        <Button type="button" onClick={() => abrirModal(null)}>
          Nuevo producto
        </Button>
      </div>

      {eliminar.isError && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{handleApiError(eliminar.error)}</p>
      )}

      {isPending && <Skeleton className="h-48" />}

      {isError && <EstadoError error={error} />}

      {data && (
        <Tabla
          table={table}
          mensajeVacio="No hay productos cargados"
          acciones={(producto) => (
            <>
              <button type="button" className="font-medium text-stone-700 hover:underline" onClick={() => abrirModal(producto)}>
                Editar
              </button>
              <button type="button" className="font-medium text-stone-700 hover:underline" onClick={() => abrirStock(producto)}>
                Stock
              </button>
              <button type="button" className="text-red-600 hover:underline" onClick={() => confirmarEliminar(producto)}>
                Eliminar
              </button>
            </>
          )}
        />
      )}

      {/* Crear o editar */}
      {modalAbierto && (
        <Modal
          titulo={editando ? 'Editar producto' : 'Nuevo producto'}
          error={guardar.isError ? handleApiError(guardar.error) : null}
          guardando={guardar.isPending}
          onGuardar={() => form.handleSubmit()}
          onCancelar={cerrarModal}
        >
          <form.Field name="nombre" validators={{ onSubmit: obligatorio }}>
            {(field) => (
              <Input
                label="Nombre"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0]}
                autoFocus
              />
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-stone-700">Descripción (opcional)</span>
                <textarea
                  className="rounded border border-stone-300 px-3 py-2"
                  rows={2}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>

          <form.Field name="precio_base" validators={{ onSubmit: precioValido }}>
            {(field) => (
              <Input
                label="Precio"
                type="number"
                min={0}
                step="0.01"
                value={valorNumero(field.state.value)}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field name="categoria_id" validators={{ onSubmit: categoriaElegida }}>
            {(field) => (
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-stone-700">Categoría</span>
                <select
                  className="rounded border border-stone-300 px-3 py-2"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                >
                  <option value={0}>Elegí una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {field.state.meta.errors[0] && <span className="text-xs text-red-600">{field.state.meta.errors[0]}</span>}
              </label>
            )}
          </form.Field>

          <form.Field name="imagen_url">
            {(field) => (
              <Input
                label="URL de la imagen (opcional)"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          {/* Al crear se carga el stock inicial. Para editarlo está el botón Stock de la tabla */}
          {!editando && (
            <>
              <form.Field name="stock" validators={{ onSubmit: stockValido }}>
                {(field) => (
                  <Input
                    label="Stock inicial"
                    type="number"
                    min={0}
                    value={valorNumero(field.state.value)}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                    error={field.state.meta.errors[0]}
                  />
                )}
              </form.Field>

              <form.Field name="disponible">
                {(field) => (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                    />
                    Disponible
                  </label>
                )}
              </form.Field>
            </>
          )}
        </Modal>
      )}

      {/* Cambio de stock y disponibilidad (PATCH /productos/{id}/stock) */}
      {productoStock && (
        <Modal
          titulo={`Stock de ${productoStock.nombre}`}
          error={cambiarStock.isError ? handleApiError(cambiarStock.error) : null}
          guardando={cambiarStock.isPending}
          onGuardar={() => formStock.handleSubmit()}
          onCancelar={() => setProductoStock(null)}
        >
          <formStock.Field name="stock" validators={{ onSubmit: stockValido }}>
            {(field) => (
              <Input
                label="Stock"
                type="number"
                min={0}
                value={valorNumero(field.state.value)}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                error={field.state.meta.errors[0]}
                autoFocus
              />
            )}
          </formStock.Field>

          <formStock.Field name="disponible">
            {(field) => (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                Disponible
              </label>
            )}
          </formStock.Field>
        </Modal>
      )}
    </section>
  )
}

export default AdminProductosPage