import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Lo que se guarda de cada producto en el carrito
export interface ItemCarrito {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
}

interface CartState {
  items: ItemCarrito[]
  agregar: (item: Omit<ItemCarrito, 'cantidad'>) => void
  quitar: (producto_id: number) => void
  cambiarCantidad: (producto_id: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
}

// persist guarda el carrito en el navegador (localStorage), así no se pierde al recargar
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Si el producto ya está en el carrito, suma 1 a la cantidad en vez de repetirlo
      agregar: (item) => {
        const existe = get().items.some((i) => i.producto_id === item.producto_id)
        set({
          items: existe
            ? get().items.map((i) => (i.producto_id === item.producto_id ? { ...i, cantidad: i.cantidad + 1 } : i))
            : [...get().items, { ...item, cantidad: 1 }],
        })
      },

      quitar: (producto_id) => set({ items: get().items.filter((i) => i.producto_id !== producto_id) }),

      // La cantidad mínima es 1. Para sacar el producto se usa quitar
      cambiarCantidad: (producto_id, cantidad) =>
        set({
          items: get().items.map((i) => (i.producto_id === producto_id ? { ...i, cantidad: Math.max(1, cantidad) } : i)),
        }),

      vaciar: () => set({ items: [] }),

      total: () => get().items.reduce((suma, i) => suma + i.precio_unitario * i.cantidad, 0),
    }),
    { name: 'carrito' },
  ),
)