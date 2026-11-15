from datetime import datetime
from typing import Optional
from sqlmodel import Session, col, func, select
from app.core.base_repository import BaseRepository
from .models import EstadoPedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    # Con usuario_id trae los pedidos de ese usuario; con None, los de todos (para el admin)
    def list_by_usuario(
        self,
        usuario_id: Optional[int],
        skip: int,
        limit: int,
        estado: Optional[EstadoPedido] = None,
    ) -> tuple[list[Pedido], int]:
        query = select(Pedido)
        if usuario_id is not None:
            query = query.where(Pedido.usuario_id == usuario_id)
        if estado is not None:
            query = query.where(Pedido.estado == estado)

        total = self.session.exec(select(func.count()).select_from(query.subquery())).one()
        items = self.session.exec(query.order_by(col(Pedido.id).desc()).offset(skip).limit(limit)).all()
        return list(items), total

    # Consultas para el resumen del panel
    def count_by_estado(self, estado: EstadoPedido) -> int:
        return self.session.exec(select(func.count()).where(Pedido.estado == estado)).one()

    def count_desde(self, desde: datetime) -> int:
        return self.session.exec(select(func.count()).where(Pedido.created_at >= desde)).one()

    def sum_total_by_estado(self, estado: EstadoPedido) -> float:
        # coalesce devuelve 0 en lugar de None cuando no hay pedidos
        return self.session.exec(select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == estado)).one()