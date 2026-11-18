import Card from '../../../shared/ui/Card'

interface TarjetaResumenProps {
  titulo: string
  valor: string | number
}

// Un indicador del resumen: el número grande y abajo qué es
function TarjetaResumen({ titulo, valor }: TarjetaResumenProps) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-3xl font-bold text-gray-800">{valor}</span>
      <span className="text-sm text-gray-500">{titulo}</span>
    </Card>
  )
}

export default TarjetaResumen