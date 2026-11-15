from typing import Generic, Optional, Type, TypeVar
from sqlmodel import Session, SQLModel, col, select

# Cualquier modelo, siempre que herede de SQLModel
T = TypeVar("T", bound=SQLModel)


# Repositorio base: solo accede a datos. No hace commit --> eso lo hace la Unit of Work.
class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: Type[T]):
        self.session = session
        self.model = model

    # True si el modelo tiene el campo "activo". Usuario no lo tiene (su baja es con "disabled"),
    # así que a los usuarios no se les esconden los dados de baja
    def _tiene_baja_logica(self) -> bool:
        return hasattr(self.model, "activo")

    # Un registro dado de baja se trata como si no existiera
    def get_by_id(self, id: int) -> Optional[T]:
        entidad = self.session.get(self.model, id)
        if entidad and self._tiene_baja_logica() and not entidad.activo:  # type: ignore[attr-defined]
            return None
        return entidad

    def get_all(self) -> list[T]:
        query = select(self.model).order_by(col(self.model.id))  # type: ignore[attr-defined]
        if self._tiene_baja_logica():
            query = query.where(col(self.model.activo))  # type: ignore[attr-defined]
        return list(self.session.exec(query).all())

    # flush manda el INSERT a la base sin confirmarlo, así el registro ya tiene su id
    def add(self, entidad: T) -> T:
        self.session.add(entidad)
        self.session.flush()
        self.session.refresh(entidad)
        return entidad

    # DELETE no borra la fila: la marca como inactiva
    def delete(self, entidad: T) -> None:
        entidad.activo = False  # type: ignore[attr-defined]
        self.session.add(entidad)
        self.session.flush()