import { useMutation } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { obligatorio } from '../../../shared/utils/validaciones'
import { useAuthStore } from '../../../store/authStore'
import type { LoginInput } from '../types/auth'

function LoginPage() {
  const usuario = useAuthStore((state) => state.usuario)
  const login = useAuthStore((state) => state.login)
  // RegisterPage manda { registrado: true } al redirigir acá
  const location = useLocation()
  const recienRegistrado = (location.state as { registrado?: boolean } | null)?.registrado

  // Si el login falla, ingresar.error tiene el error y se muestra abajo del formulario
  const ingresar = useMutation({
    mutationFn: (datos: LoginInput) => login(datos),
  })

  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: ({ value }) => ingresar.mutate(value),
  })

  // Con sesión va al catálogo
  if (usuario) {
    return <Navigate to="/" replace />
  }

  return (
    // min-h-[70vh] con items-center deja la tarjeta centrada en la pantalla, también de arriba a abajo
    <div className="flex min-h-[70vh] items-center justify-center">
      <section className="flex w-full max-w-sm flex-col gap-4 rounded bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-stone-800">Iniciar sesión</h1>

        {recienRegistrado && (
          <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">Cuenta creada. Ya podés iniciar sesión.</p>
        )}

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.Field name="username" validators={{ onSubmit: obligatorio }}>
            {(field) => (
              <Input
                label="Usuario"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0]}
                autoComplete="username"
                autoFocus
              />
            )}
          </form.Field>

          <form.Field name="password" validators={{ onSubmit: obligatorio }}>
            {(field) => (
              <Input
                label="Contraseña"
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors[0]}
                autoComplete="current-password"
              />
            )}
          </form.Field>

          {ingresar.isError && (
            <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{handleApiError(ingresar.error)}</p>
          )}

          <Button type="submit" disabled={ingresar.isPending}>
            {ingresar.isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        <p className="text-center text-sm text-stone-600">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-orange-600 hover:underline">
            Registrate
          </Link>
        </p>
      </section>
    </div>
  )
}

export default LoginPage
