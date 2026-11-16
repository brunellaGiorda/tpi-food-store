// Validadores para TanStack Form: devuelven el mensaje de error, o undefined si el valor es válido.
// Repiten las reglas del backend para avisar antes de mandar el formulario.
type ValidadorTexto = ({ value }: { value: string }) => string | undefined

export const obligatorio: ValidadorTexto = ({ value }) => (value.trim() ? undefined : 'Campo obligatorio')

export const usuarioValido: ValidadorTexto = ({ value }) =>
  value.trim().length >= 3 ? undefined : 'El usuario debe tener al menos 3 caracteres'

export const emailValido: ValidadorTexto = ({ value }) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : 'El email no es válido'

export const passwordValida: ValidadorTexto = ({ value }) =>
  value.length >= 8 ? undefined : 'La contraseña debe tener al menos 8 caracteres'