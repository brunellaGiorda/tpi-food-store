import { getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { handleApiError } from '../../../shared/api/handleApiError'
import EstadoError from '../../../shared/components/EstadoError'
import Skeleton from '../../../shared/components/Skeleton'
import Tabla from '../../../shared/components/Tabla'
import { useAuthStore } from '../../../store/authStore'
import type { Usuario } from '../../auth/types/auth'
import { useCambiarEstadoUsuario, useUsuarios } from '../hooks/useUsuarios'

const columnas: ColumnDef<Usuario>[] = [
  { accessorKey: 'username', header: 'Usuario' },
  { accessorKey: 'full_name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Rol' },
  {
    accessorKey: 'disabled',
    header: 'Estado',
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <span className="rounded bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-700">Desactivado</span>
      ) : (
        <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Activo</span>
      ),
  },
]

function AdminUsuariosPage() {
  const { data: usuarios = [], isPending, isError, error } = useUsuarios()
  const cambiarEstado = useCambiarEstadoUsuario()
  // Para no mostrar "Desactivar" en la fila del admin que está usando el panel
  const usernameActual = useAuthStore((state) => state.usuario?.username)

  const table = useReactTable({
    data: usuarios,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  function confirmarDesactivar(usuario: Usuario) {
    if (window.confirm(`¿Desactivar a "${usuario.username}"? No va a poder iniciar sesión.`)) {
      cambiarEstado.mutate({ id: usuario.id, activar: false })
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-stone-800">Usuarios</h1>

      {cambiarEstado.isError && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{handleApiError(cambiarEstado.error)}</p>
      )}

      {isPending && <Skeleton className="h-48" />}

      {isError && <EstadoError error={error} />}

      {!isPending && !isError && (
        <Tabla
          table={table}
          mensajeVacio="No hay usuarios"
          acciones={(usuario) => {
            if (usuario.disabled) {
              return (
                <button
                  type="button"
                  className="font-medium text-stone-700 hover:underline disabled:opacity-50"
                  disabled={cambiarEstado.isPending}
                  onClick={() => cambiarEstado.mutate({ id: usuario.id, activar: true })}
                >
                  Activar
                </button>
              )
            }
            // El admin no puede desactivarse a sí mismo (el back también lo rechaza)
            if (usuario.username === usernameActual) return null
            return (
              <button
                type="button"
                className="text-red-600 hover:underline disabled:opacity-50"
                disabled={cambiarEstado.isPending}
                onClick={() => confirmarDesactivar(usuario)}
              >
                Desactivar
              </button>
            )
          }}
        />
      )}
    </section>
  )
}

export default AdminUsuariosPage