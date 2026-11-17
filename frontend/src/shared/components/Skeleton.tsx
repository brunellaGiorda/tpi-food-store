// Bloque gris que parpadea mientras cargan los datos. El tamaño se pasa con className.
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
}

export default Skeleton