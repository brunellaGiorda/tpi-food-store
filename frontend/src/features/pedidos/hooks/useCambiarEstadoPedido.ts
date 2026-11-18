import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cambiarEstadoPedido } from '../api/pedidos'
import type { EstadoPedido } from '../types/pedido'

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) => cambiarEstadoPedido(id, estado),
    // Se refrescan los pedidos (y con ellos el resumen) y los productos, por si se canceló y volvió el stock
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}