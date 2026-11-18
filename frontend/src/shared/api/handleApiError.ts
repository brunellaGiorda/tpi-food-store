import { AxiosError } from 'axios'

// Convierte el error de una petición en un mensaje para mostrar en pantalla
export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor'
    }
    const detail: unknown = error.response.data?.detail
    // Los errores propios del backend traen un texto; los 422 de validación traen una lista
    return typeof detail === 'string' ? detail : 'Los datos enviados no son válidos'
  }
  return 'Ocurrió un error inesperado'
}