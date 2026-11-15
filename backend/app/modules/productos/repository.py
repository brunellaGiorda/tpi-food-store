from typing import Optional
from sqlmodel import Session, col, func, select
from app.core.base_repository import BaseRepository
from .models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    # Listado paginado de los activos. Devuelve la página pedida y el total sin paginar.
    def search(
        self,
        skip: int,
        limit: int,
        nombre: Optional[str] = None,
        categoria_id: Optional[int] = None,
        disponible: Optional[bool] = None,
    ) -> tuple[list[Producto], int]:
        query = select(Producto).where(col(Producto.activo))
        if nombre:
            query = query.where(col(Producto.nombre).ilike(f"%{nombre}%"))  # ilike no distingue mayúsculas
        if categoria_id is not None:
            query = query.where(Producto.categoria_id == categoria_id)
        if disponible is not None:
            query = query.where(Producto.disponible == disponible)

        total = self.session.exec(select(func.count()).select_from(query.subquery())).one()
        items = self.session.exec(query.order_by(col(Producto.id)).offset(skip).limit(limit)).all()
        return list(items), total