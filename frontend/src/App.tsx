import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './shared/api/axiosInstance'

// Prueba temporal
interface ProductoPrueba {
  id: number
  nombre: string
}

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const respuesta = await axiosInstance.get<{ total: number; items: ProductoPrueba[] }>('/productos')
      return respuesta.data
    },
  })

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800">Food Store</h1>

      {isLoading && <p className="mt-4 text-gray-500">Cargando...</p>}
      {isError && <p className="mt-4 text-red-600">No se pudo conectar con el backend</p>}
      {data && (
        <ul className="mt-4 list-disc pl-6 text-gray-700">
          {data.items.map((producto) => (
            <li key={producto.id}>{producto.nombre}</li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
