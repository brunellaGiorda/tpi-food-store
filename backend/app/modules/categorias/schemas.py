from typing import Optional
from sqlmodel import Field, SQLModel


class CategoriaCreate(SQLModel):
    model_config = {"str_strip_whitespace": True}

    nombre: str = Field(min_length=2, max_length=100)
    descripcion: Optional[str] = None


# PUT: todos los campos son opcionales, se actualizan solo los que se mandan
class CategoriaUpdate(SQLModel):
    model_config = {"str_strip_whitespace": True}

    nombre: Optional[str] = Field(default=None, min_length=2, max_length=100)
    descripcion: Optional[str] = None


class CategoriaRead(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    activo: bool