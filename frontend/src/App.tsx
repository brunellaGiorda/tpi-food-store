import { useEffect } from 'react'
import AppRouter from './routes/AppRouter'
import { useAuthStore } from './store/authStore'

function App() {
  const checkSession = useAuthStore((state) => state.checkSession)

  // Al abrir o recargar la app se confirma la sesión con /auth/me
  useEffect(() => {
    checkSession()
  }, [checkSession])

  return <AppRouter />
}

export default App
