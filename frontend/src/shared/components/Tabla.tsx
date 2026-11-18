import { flexRender, type Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import Paginacion from './Paginacion'

interface TablaProps<T> {
  // La instancia de TanStack Table que arma cada página con sus columnas
  table: Table<T>
  mensajeVacio: string
  // Botones de cada fila (Editar, Eliminar...)
  acciones?: (fila: T) => ReactNode
}

// Tabla para las pantallas del admin. La paginación es del lado del cliente.
function Tabla<T>({ table, mensajeVacio, acciones }: TablaProps<T>) {
  const filas = table.getRowModel().rows
  const cantidadColumnas = table.getAllLeafColumns().length + (acciones ? 1 : 0)

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-700">
            {table.getHeaderGroups().map((grupo) => (
              <tr key={grupo.id}>
                {grupo.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                {acciones && <th className="px-4 py-2 text-right font-semibold">Acciones</th>}
              </tr>
            ))}
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td colSpan={cantidadColumnas} className="px-4 py-6 text-center text-stone-500">
                  {mensajeVacio}
                </td>
              </tr>
            ) : (
              filas.map((fila) => (
                <tr key={fila.id} className="border-t border-stone-200">
                  {fila.getVisibleCells().map((celda) => (
                    <td key={celda.id} className="px-4 py-2">
                      {flexRender(celda.column.columnDef.cell, celda.getContext())}
                    </td>
                  ))}
                  {acciones && <td className="space-x-3 whitespace-nowrap px-4 py-2 text-right">{acciones(fila.original)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <Paginacion
          pagina={table.getState().pagination.pageIndex}
          totalPaginas={table.getPageCount()}
          onCambiar={table.setPageIndex}
        />
      )}
    </div>
  )
}

export default Tabla