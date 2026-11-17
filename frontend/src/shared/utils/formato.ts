// Precio con el formato argentino: 11500.99 → "$ 11.500,99"
export const formatoPrecio = (valor: number) => `$ ${valor.toLocaleString('es-AR')}`

// Fecha y hora del back en formato argentino: "16/11/26, 14:30"
export const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })