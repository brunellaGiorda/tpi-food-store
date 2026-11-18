import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 rounded bg-white p-8 text-center shadow">
      <h1 className="text-2xl font-bold text-gray-800">Acceso denegado</h1>
      <p className="text-gray-600">No tenés permisos para ver esta página.</p>
      <Link to="/" className="text-sky-600 hover:underline">
        Volver al catálogo
      </Link>
    </section>
  )
}

export default UnauthorizedPage