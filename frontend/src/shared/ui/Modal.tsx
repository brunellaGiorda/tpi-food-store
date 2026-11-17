import type { ReactNode } from 'react'
import Button from './Button'

interface ModalProps {
  titulo: string
  error: string | null
  guardando: boolean
  onGuardar: () => void
  onCancelar: () => void
  children: ReactNode
}

// Ventana con un formulario: título, campos (children), mensaje de error y botones.
// La página decide cuándo mostrarla con un estado booleano.
function Modal({ titulo, error, guardando, onGuardar, onCancelar, children }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">{titulo}</h2>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            onGuardar()
          }}
        >
          {children}

          {error && <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="rounded border border-gray-300 px-4 py-2 text-sm" onClick={onCancelar}>
              Cancelar
            </button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
