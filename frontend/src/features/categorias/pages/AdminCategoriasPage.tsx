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
import { nombreCategoriaValido } from '../../../shared/utils/validaciones'
import { useCategorias, useEliminarCategoria, useGuardarCategoria } from '../hooks/useCategorias'
import type { Categoria } from '../types/categoria'

const columnas: ColumnDef<Categoria>[] = [
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'descripcion', header: 'Descripción', cell: ({ getValue }) => getValue<string | null>() ?? '—' },
]

const valoresVacios = { nombre: '', descripcion: '' }

function AdminCategoriasPage() {
  const { data: categorias = [], isPending, isError, error } = useCategorias()
  const guardar = useGuardarCategoria()
  const eliminar = useEliminarCategoria()

  const [modalAbierto, setModalAbierto] = useState(false)
  // null: se está creando una nueva. Con una categoría: se está editando esa.
  const [editando, setEditando] = useState<Categoria | null>(null)

  const form = useForm({
    defaultValues: valoresVacios,
    // Si sale bien se cierra el modal; si falla (ej. nombre repetido) queda abierto con el error
    onSubmit: ({ value }) =>
      guardar.mutate(
        { id: editando?.id, datos: { nombre: value.nombre, descripcion: value.descripcion.trim() || null } },
        { onSuccess: cerrarModal },
      ),
  })

  // Paginación del lado del cliente: el back manda todas y la tabla muestra de a 10
  const table = useReactTable({
    data: categorias,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  function abrirModal(categoria: Categoria | null) {
    setEditando(categoria)
    // Carga los datos en el form. keepDefaultValues evita que el form se vuelva a vaciar solo
    form.reset(categoria ? { nombre: categoria.nombre, descripcion: categoria.descripcion ?? '' } : valoresVacios, {
      keepDefaultValues: true,
    })
    guardar.reset()
    setModalAbierto(true)
  }

  function cerrarModal() {
    setModalAbierto(false)
    setEditando(null)
  }

  // La baja de una categoría no oculta sus productos (lo dice la consigna), por eso se avisa
  function confirmarEliminar(categoria: Categoria) {
    if (window.confirm(`¿Eliminar la categoría "${categoria.nombre}"? Sus productos siguen en el catálogo.`)) {
      eliminar.mutate(categoria.id)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Categorías</h1>
        <Button type="button" onClick={() => abrirModal(null)}>
          Nueva categoría
        </Button>
      </div>

      {eliminar.isError && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{handleApiError(eliminar.error)}</p>
      )}

      {isPending && <Skeleton className="h-48" />}

      {isError && <EstadoError error={error} />}

      {!isPending && !isError && (
        <Tabla
          table={table}
          mensajeVacio="No hay categorías cargadas"
          acciones={(categoria) => (
            <>
              <button type="button" className="font-medium text-stone-700 hover:underline" onClick={() => abrirModal(categoria)}>
                Editar
              </button>
              <button type="button" className="text-red-600 hover:underline" onClick={() => confirmarEliminar(categoria)}>
                Eliminar
              </button>
            </>
          )}
        />
      )}

      {modalAbierto && (
        <Modal
          titulo={editando ? 'Editar categoría' : 'Nueva categoría'}
          error={guardar.isError ? handleApiError(guardar.error) : null}
          guardando={guardar.isPending}
          onGuardar={() => form.handleSubmit()}
          onCancelar={cerrarModal}
        >
          <form.Field name="nombre" validators={{ onSubmit: nombreCategoriaValido }}>
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
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>
        </Modal>
      )}
    </section>
  )
}

export default AdminCategoriasPage