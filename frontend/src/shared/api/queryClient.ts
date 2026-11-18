import { QueryClient } from '@tanstack/react-query'

// Una sola instancia para toda la app: guarda en caché los datos que vienen del servidor
export const queryClient = new QueryClient()