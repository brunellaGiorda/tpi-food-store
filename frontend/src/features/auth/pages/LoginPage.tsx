import { useMutation } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Link, Navigate } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { useAuthStore } from '../../../store/authStore'
import type { LoginInput } from '../types/auth'

const obligatorio = ({ value }: { value: string }) => (value.trim() ? undefined : 'Campo obligatorio')

function LoginPage() {
  const usuario = useAuthStore((state) => state.usuario)
  const login = useAuthStore((state) => state.login)

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
    <section className="mx-auto flex max-w-sm flex-col gap-4 rounded bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-gray-800">Iniciar sesión</h1>

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

      <p className="text-sm text-gray-600">
        ¿No tenés cuenta?{' '}
        <Link to="/register" className="text-sky-600 hover:underline">
          Registrate
        </Link>
      </p>
    </section>
  )
}

export default LoginPage