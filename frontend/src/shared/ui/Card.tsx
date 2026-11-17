import type { HTMLAttributes } from 'react'

// Caja blanca con borde redondeado y sombra
function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded bg-white p-4 shadow ${className}`} {...props} />
}

export default Card