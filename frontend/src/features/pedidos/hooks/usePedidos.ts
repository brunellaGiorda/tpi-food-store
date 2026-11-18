import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listarPedidos } from '../api/pedidos'
import type { FiltrosPedidos } from '../types/pedido'

// Igual que useProductos: los filtros van en la queryKey
export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: ['pedidos', filtros],
    queryFn: () => listarPedidos(filtros),
    placeholderData: keepPreviousData,
  })
}