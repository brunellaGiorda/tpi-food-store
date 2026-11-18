// Categoría tal como la devuelve el backend (CategoriaRead)
export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
}

// Lo que se manda en POST y PUT /categorias (CategoriaCreate y CategoriaUpdate)
export interface CategoriaInput {
  nombre: string
  descripcion: string | null
}