from typing import Optional
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic
from .models import DetallePedido, EstadoPedido, Pedido
from .schemas import PedidoCreate, PedidoRead, PedidosPaginados
from .unit_of_work import PedidoUnitOfWork


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
                    producto_id=producto.id,
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

    # Busca el pedido y controla que sea del usuario (salvo que sea admin)
    def _buscar(self, uow: PedidoUnitOfWork, id: int, usuario: UserPublic) -> Pedido:
        pedido = uow.pedidos.get_by_id(id)
        if not pedido:
            raise PedidoNoEncontrado("Pedido no encontrado")
        if usuario.role != "admin" and pedido.usuario_id != usuario.id:
            raise PedidoAjeno("El pedido es de otro usuario")
        return pedido