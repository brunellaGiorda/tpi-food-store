from datetime import datetime
from typing import Optional
from app.core.fechas import ahora
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic
from .models import DetallePedido, EstadoPedido, Pedido
from .schemas import PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from .unit_of_work import PedidoUnitOfWork

# Máquina de estados: a qué estados se puede pasar desde cada uno. ENTREGADO y CANCELADO son terminales.
TRANSICIONES = {
    EstadoPedido.PENDIENTE: [EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO],
    EstadoPedido.EN_PREPARACION: [EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO],
    EstadoPedido.ENTREGADO: [],
    EstadoPedido.CANCELADO: [],
}


class PedidoNoEncontrado(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class ProductoRepetido(Exception):
    pass


class ProductoNoDisponible(Exception):
    pass


class StockInsuficiente(Exception):
    pass


class TransicionInvalida(Exception):
    pass


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    # RN-01: todo pasa en una sola transacción. Si algo falla, el UoW hace rollback
    # y no queda ni el pedido ni el stock descontado.
    def crear(self, data: PedidoCreate, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            ids = [item.producto_id for item in data.items]
            if len(ids) != len(set(ids)):
                raise ProductoRepetido("Hay productos repetidos en el pedido")

            pedido = uow.pedidos.add(Pedido(
                usuario_id=usuario.id,
                forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega,
                notas=data.notas,
                total=0,
            ))

            total = 0.0
            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if not producto:
                    raise ProductoNoEncontrado(f"Producto {item.producto_id} no encontrado")
                if not producto.disponible:
                    raise ProductoNoDisponible(f"{producto.nombre} no está disponible")
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(f"Stock insuficiente para {producto.nombre}")

                producto.stock -= item.cantidad
                subtotal = producto.precio_base * item.cantidad
                pedido.items.append(DetallePedido(
                    producto_id=item.producto_id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=subtotal,
                ))
                total += subtotal

            pedido.total = total
            pedido = uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    # RN-04: el user ve solo los suyos, el admin ve todos
    def listar(
        self,
        usuario: UserPublic,
        skip: int,
        limit: int,
        estado: Optional[EstadoPedido],
    ) -> PedidosPaginados:
        with self.uow as uow:
            usuario_id = None if usuario.role == "admin" else usuario.id
            pedidos, total = uow.pedidos.list_by_usuario(usuario_id, skip, limit, estado)
            return PedidosPaginados(total=total, items=[PedidoRead.model_validate(p) for p in pedidos])

    def obtener(self, id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            return PedidoRead.model_validate(self._buscar(uow, id, usuario))

    # Admin: avanza o cancela según la máquina de estados
    def cambiar_estado(self, id: int, nuevo_estado: EstadoPedido, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = self._buscar(uow, id, usuario)
            self._aplicar_transicion(pedido, nuevo_estado)
            pedido = uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    # Cliente: solo cancela sus propios pedidos y solo desde PENDIENTE (RN-04)
    def cancelar(self, id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(id)
            if not pedido:
                raise PedidoNoEncontrado("Pedido no encontrado")
            if pedido.usuario_id != usuario.id:
                raise PedidoAjeno("El pedido es de otro usuario")
            if pedido.estado != EstadoPedido.PENDIENTE:
                raise TransicionInvalida("Solo se pueden cancelar pedidos pendientes")
            self._aplicar_transicion(pedido, EstadoPedido.CANCELADO)
            pedido = uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            inicio_de_hoy = datetime.now().astimezone().replace(hour=0, minute=0, second=0, microsecond=0)
            return ResumenPedidos(
                pendientes=uow.pedidos.count_by_estado(EstadoPedido.PENDIENTE),
                en_preparacion=uow.pedidos.count_by_estado(EstadoPedido.EN_PREPARACION),
                entregados=uow.pedidos.count_by_estado(EstadoPedido.ENTREGADO),
                cancelados=uow.pedidos.count_by_estado(EstadoPedido.CANCELADO),
                pedidos_hoy=uow.pedidos.count_desde(inicio_de_hoy),
                ingresos_entregados=uow.pedidos.sum_total_by_estado(EstadoPedido.ENTREGADO),
            )

    # RN-02 y RN-03: valida la transición antes de tocar el pedido; al cancelar devuelve el stock
    def _aplicar_transicion(self, pedido: Pedido, nuevo_estado: EstadoPedido) -> None:
        if nuevo_estado not in TRANSICIONES[pedido.estado]:
            raise TransicionInvalida(f"No se puede pasar de {pedido.estado.value} a {nuevo_estado.value}")
        if nuevo_estado == EstadoPedido.CANCELADO:
            for item in pedido.items:
                item.producto.stock += item.cantidad  # type: ignore[union-attr]
        pedido.estado = nuevo_estado
        pedido.updated_at = ahora()

    # Busca el pedido y controla que sea del usuario (salvo que sea admin)
    def _buscar(self, uow: PedidoUnitOfWork, id: int, usuario: UserPublic) -> Pedido:
        pedido = uow.pedidos.get_by_id(id)
        if not pedido:
            raise PedidoNoEncontrado("Pedido no encontrado")
        if usuario.role != "admin" and pedido.usuario_id != usuario.id:
            raise PedidoAjeno("El pedido es de otro usuario")
        return pedido