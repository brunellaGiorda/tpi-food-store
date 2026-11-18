import type { ButtonHTMLAttributes } from 'react'

function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700 disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export default Button