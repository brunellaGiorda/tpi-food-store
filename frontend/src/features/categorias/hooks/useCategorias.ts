import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { actualizarCategoria, crearCategoria, eliminarCategoria, listarCategorias } from '../api/categorias'
import type { CategoriaInput } from '../types/categoria'

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: listarCategorias,
  })
}

// Se refrescan las categorías y también los productos, que muestran el nombre de su categoría
function useRefrescar() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['categorias'] })
    queryClient.invalidateQueries({ queryKey: ['productos'] })
  }
}

// Con id edita, sin id crea
export function useGuardarCategoria() {
  const refrescar = useRefrescar()
  return useMutation({
    mutationFn: ({ id, datos }: { id?: number; datos: CategoriaInput }) =>
      id ? actualizarCategoria(id, datos) : crearCategoria(datos),
    onSuccess: refrescar,
  })
}

export function useEliminarCategoria() {
  const refrescar = useRefrescar()
  return useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: refrescar,
  })
}