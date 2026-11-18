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

// Lo que se manda en POST y PUT /productos (ProductoCreate y ProductoUpdate)
export interface ProductoInput {
  nombre: string
  descripcion: string | null
  precio_base: number
  imagen_url: string | null
  categoria_id: number
  // Al editar no se mandan: el stock se cambia aparte con PATCH /productos/{id}/stock
  stock?: number
  disponible?: boolean
}

// Lo que se manda en PATCH /productos/{id}/stock (ProductoStockUpdate)
export interface StockInput {
  stock: number
  disponible: boolean
}

// Parámetros que acepta GET /productos
export interface FiltrosProductos {
  skip: number
  limit: number
  search?: string
  categoria_id?: number
}