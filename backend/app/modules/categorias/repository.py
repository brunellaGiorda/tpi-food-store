from typing import Optional
from sqlmodel import Session, func, select
from app.core.base_repository import BaseRepository
from .models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    # Busca también entre las dadas de baja: la baja no libera el nombre.
    # Compara en minúscula, así "Bebidas" y "bebidas" cuentan como el mismo nombre.
    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        return self.session.exec(select(Categoria).where(func.lower(Categoria.nombre) == nombre.lower())).first()