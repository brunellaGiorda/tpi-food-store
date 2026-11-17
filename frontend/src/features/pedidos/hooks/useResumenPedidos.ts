import { useQuery } from '@tanstack/react-query'
import { obtenerResumen } from '../api/pedidos'

// La key empieza con 'pedidos': cuando se invalidan los pedidos, el resumen también se vuelve a pedir
export function useResumenPedidos() {
  return useQuery({
    queryKey: ['pedidos', 'resumen'],
    queryFn: obtenerResumen,
  })
}