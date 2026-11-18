import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

// Marco de todas las páginas: la Navbar arriba y, en el Outlet, la página de la ruta actual
function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout