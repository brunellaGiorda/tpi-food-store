import { useState } from 'react'
import EstadoError from '../../../shared/components/EstadoError'
import EstadoVacio from '../../../shared/components/EstadoVacio'
import Paginacion from '../../../shared/components/Paginacion'
import Skeleton from '../../../shared/components/Skeleton'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import ProductoCard from '../components/ProductoCard'
import { useProductos } from '../hooks/useProductos'

const PRODUCTOS_POR_PAGINA = 6

function CatalogoPage() {
  const [pagina, setPagina] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)

  const { data: categorias = [] } = useCategorias()
  // Paginación en el servidor: skip = página × limit
  const { data, isPending, isError, error } = useProductos({
    skip: pagina * PRODUCTOS_POR_PAGINA,
    limit: PRODUCTOS_POR_PAGINA,
    search: busqueda.trim() || undefined,
    categoria_id: categoriaId,
  })

  const totalPaginas = data ? Math.ceil(data.total / PRODUCTOS_POR_PAGINA) : 0

  const hayFiltros = busqueda !== '' || categoriaId !== undefined

  // Al cambiar la búsqueda o la categoría se vuelve a la primera página
  function buscar(texto: string) {
    setBusqueda(texto)
    setPagina(0)
  }

  function elegirCategoria(valor: string) {
    setCategoriaId(valor ? Number(valor) : undefined)
    setPagina(0)
  }

  function limpiarFiltros() {
    setBusqueda('')
    setCategoriaId(undefined)
    setPagina(0)
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Catálogo</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => buscar(e.target.value)}
        />

        <select
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
          value={categoriaId ?? ''}
          onChange={(e) => elegirCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        {hayFiltros && (
          <button type="button" className="text-sm text-sky-600 hover:underline" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        )}
      </div>

      {isPending && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PRODUCTOS_POR_PAGINA }, (_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      )}

      {isError && <EstadoError error={error} />}

      {data && data.items.length === 0 && <EstadoVacio mensaje="No se encontraron productos" />}

      {data && data.items.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}
    </section>
  )
}

export default CatalogoPage