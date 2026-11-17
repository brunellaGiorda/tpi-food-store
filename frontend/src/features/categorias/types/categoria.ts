// Categoría tal como la devuelve el backend (CategoriaRead)
export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
}