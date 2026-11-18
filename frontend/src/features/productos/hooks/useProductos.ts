import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { actualizarProducto, cambiarStock, crearProducto, eliminarProducto, listarProductos } from '../api/productos'
import type { FiltrosProductos, ProductoInput, StockInput } from '../types/producto'

// Los filtros van en la queryKey: si cambia la página, la búsqueda o la categoría, se pide de nuevo
export function useProductos(filtros: FiltrosProductos) {
  return useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => listarProductos(filtros),
    // Mientras llega la lista nueva se sigue mostrando la anterior, así no parpadea al escribir o cambiar de página
    placeholderData: keepPreviousData,
  })
}

// Después de cualquier cambio se refrescan todas las listas de productos (catálogo y panel)
function useRefrescar() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['productos'] })
}

// Con id edita, sin id crea
export function useGuardarProducto() {
  const refrescar = useRefrescar()
  return useMutation({
    mutationFn: ({ id, datos }: { id?: number; datos: ProductoInput }) =>
      id ? actualizarProducto(id, datos) : crearProducto(datos),
    onSuccess: refrescar,
  })
}

export function useCambiarStock() {
  const refrescar = useRefrescar()
  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: StockInput }) => cambiarStock(id, datos),
    onSuccess: refrescar,
  })
}

export function useEliminarProducto() {
  const refrescar = useRefrescar()
  return useMutation({
    mutationFn: eliminarProducto,
    onSuccess: refrescar,
  })
}
