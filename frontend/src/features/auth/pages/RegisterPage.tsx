import { useMutation } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import Button from '../../../shared/ui/Button'
import Input from '../../../shared/ui/Input'
import { emailValido, obligatorio, passwordValida, usuarioValido } from '../../../shared/utils/validaciones'
import { registrar } from '../api/auth'
import type { RegisterInput } from '../types/auth'

const valoresVacios: RegisterInput = { username: '', full_name: '', email: '', password: '' }

// Campos del formulario: nombre, etiqueta, tipo de input y validación
const campos = [
  { name: 'username', label: 'Usuario', type: 'text', validar: usuarioValido },
  { name: 'full_name', label: 'Nombre completo', type: 'text', validar: obligatorio },
  { name: 'email', label: 'Email', type: 'email', validar: emailValido },
  { name: 'password', label: 'Contraseña (mínimo 8 caracteres)', type: 'password', validar: passwordValida },
] as const

function RegisterPage() {
  const navigate = useNavigate()

  // Si sale bien va al login con un aviso. Si falla (usuario o email repetido) se muestra el mensaje del back.
  const registro = useMutation({
    mutationFn: registrar,
    onSuccess: () => navigate('/login', { state: { registrado: true } }),
  })

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: ({ value }) => registro.mutate(value),
  })

  return (
    // Centrada en la pantalla, igual que el login
    <div className="flex min-h-[70vh] items-center justify-center">
      <section className="flex w-full max-w-sm flex-col gap-4 rounded bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-stone-800">Crear cuenta</h1>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {campos.map((campo) => (
            <form.Field key={campo.name} name={campo.name} validators={{ onSubmit: campo.validar }}>
              {(field) => (
                <Input
                  label={campo.label}
                  type={campo.type}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.errors[0]}
                />
              )}
            </form.Field>
          ))}

          {registro.isError && (
            <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{handleApiError(registro.error)}</p>
          )}

          <Button type="submit" disabled={registro.isPending}>
            {registro.isPending ? 'Registrando...' : 'Registrarme'}
          </Button>
        </form>

        <p className="text-center text-sm text-stone-600">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-orange-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </section>
    </div>
  )
}

export default RegisterPage