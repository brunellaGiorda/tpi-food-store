from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel

# Solo para que el editor conozca el tipo, sin importar el módulo de verdad (evita importaciones circulares)
if TYPE_CHECKING:
    from app.modules.productos.models import Producto


class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100, unique=True)
    descripcion: Optional[str] = None
    activo: bool = Field(default=True)

    productos: list["Producto"] = Relationship(back_populates="categoria")