import type { Categoria } from '../../categorias/types/categoria'

// Producto tal como lo devuelve el backend (ProductoRead)
export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagen_url: string | null
  stock: number
  disponible: boolean
  activo: boolean
  categoria_id: number
  categoria: Categoria
}

// Respuesta de GET /productos (ProductosPaginados)
export interface ProductosPaginados {
  total: number
  items: Producto[]
}

// Parámetros que acepta GET /productos
export interface FiltrosProductos {
  skip: number
  limit: number
  search?: string
  categoria_id?: number
}