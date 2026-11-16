import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import UnauthorizedPage from '../features/auth/pages/UnauthorizedPage'
import AdminResumenPage from '../features/pedidos/pages/AdminResumenPage'
import CarritoPage from '../features/pedidos/pages/CarritoPage'
import CheckoutPage from '../features/pedidos/pages/CheckoutPage'
import MisPedidosPage from '../features/pedidos/pages/MisPedidosPage'
import CatalogoPage from '../features/productos/pages/CatalogoPage'
import MainLayout from '../shared/layout/MainLayout'
import ProtectedRoute from './ProtectedRoute'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Públicas */}
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Con sesión iniciada */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/mis-pedidos" element={<MisPedidosPage />} />
          </Route>

          {/* Solo admin */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin/resumen" element={<AdminResumenPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter