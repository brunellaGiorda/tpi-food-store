import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

// Campo de formulario con su etiqueta y, si hay, el mensaje de error abajo
function Input({ label, error, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <input className="w-full rounded border border-gray-300 px-3 py-2" {...props} />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}

export default Input