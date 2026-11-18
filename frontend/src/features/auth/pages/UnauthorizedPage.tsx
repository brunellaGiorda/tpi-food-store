import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <section className="flex w-full max-w-md flex-col items-center gap-4 rounded bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-stone-800">Acceso denegado</h1>
        <p className="text-stone-600">No tenés permisos para ver esta página.</p>
        <Link to="/" className="text-orange-600 hover:underline">
          Volver al catálogo
        </Link>
      </section>
    </div>
  )
}

export default UnauthorizedPage