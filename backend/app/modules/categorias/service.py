from .models import Categoria
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .unit_of_work import CategoriaUnitOfWork


# Excepciones de dominio: el router las traduce a códigos HTTP
class CategoriaNoEncontrada(Exception):
    pass


class NombreDuplicado(Exception):
    pass


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    def listar(self) -> list[CategoriaRead]:
        with self.uow as uow:
            return [CategoriaRead.model_validate(c) for c in uow.categorias.get_all()]

    def obtener(self, id: int) -> CategoriaRead:
        with self.uow as uow:
            return CategoriaRead.model_validate(self._buscar(uow, id))

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            if uow.categorias.get_by_nombre(data.nombre):
                raise NombreDuplicado("Ya existe una categoría con ese nombre")
            categoria = uow.categorias.add(Categoria.model_validate(data))
            return CategoriaRead.model_validate(categoria)

    # Se cambian solo los campos que vienen en el cuerpo
    def actualizar(self, id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = self._buscar(uow, id)
            cambios = data.model_dump(exclude_none=True)
            if "nombre" in cambios:
                existente = uow.categorias.get_by_nombre(cambios["nombre"])
                if existente and existente.id != id:
                    raise NombreDuplicado("Ya existe una categoría con ese nombre")
            categoria.sqlmodel_update(cambios)
            categoria = uow.categorias.add(categoria)
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            uow.categorias.delete(self._buscar(uow, id))

    def _buscar(self, uow: CategoriaUnitOfWork, id: int) -> Categoria:
        categoria = uow.categorias.get_by_id(id)
        if not categoria:
            raise CategoriaNoEncontrada("Categoría no encontrada")
        return categoria