import { handleApiError } from '../api/handleApiError'

// Recibe el error de useQuery y muestra el mensaje que mandó el back
function EstadoError({ error }: { error: unknown }) {
  return <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{handleApiError(error)}</p>
}

export default EstadoError