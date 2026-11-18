interface PaginacionProps {
  pagina: number // empieza en 0
  totalPaginas: number
  onCambiar: (pagina: number) => void
}

function Paginacion({ pagina, totalPaginas, onCambiar }: PaginacionProps) {
  const estiloBoton = 'rounded border border-orange-300 bg-white px-3 py-1 text-sm text-orange-700 hover:bg-orange-50 disabled:opacity-50'

  return (
    <div className="flex items-center justify-center gap-3">
      <button type="button" className={estiloBoton} disabled={pagina === 0} onClick={() => onCambiar(pagina - 1)}>
        Anterior
      </button>
      <span className="text-sm text-stone-600">
        Página {pagina + 1} de {totalPaginas}
      </span>
      <button
        type="button"
        className={estiloBoton}
        disabled={pagina + 1 >= totalPaginas}
        onClick={() => onCambiar(pagina + 1)}
      >
        Siguiente
      </button>
    </div>
  )
}

export default Paginacion