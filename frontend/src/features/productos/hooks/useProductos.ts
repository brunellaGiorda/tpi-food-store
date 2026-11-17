import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listarProductos } from '../api/productos'
import type { FiltrosProductos } from '../types/producto'

// Los filtros van en la queryKey: si cambia la página, la búsqueda o la categoría, se pide de nuevo
export function useProductos(filtros: FiltrosProductos) {
  return useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => listarProductos(filtros),
    // Mientras llega la lista nueva se sigue mostrando la anterior, así no parpadea al escribir o cambiar de página
    placeholderData: keepPreviousData,
  })
}