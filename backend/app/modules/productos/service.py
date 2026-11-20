from typing import Optional
from app.modules.categorias.service import CategoriaNoEncontrada
from .models import Producto
from .schemas import ProductoCreate, ProductoRead, ProductosPaginados, ProductoStockUpdate, ProductoUpdate
from .unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork):
        self.uow = uow

    def listar(
        self,
        skip: int,
        limit: int,
        search: Optional[str],
        categoria_id: Optional[int],
        disponible: Optional[bool],
    ) -> ProductosPaginados:
        with self.uow as uow:
            productos, total = uow.productos.search(skip, limit, search, categoria_id, disponible)
            return ProductosPaginados(total=total, items=[ProductoRead.model_validate(p) for p in productos])

    def obtener(self, id: int) -> ProductoRead:
        with self.uow as uow:
            return ProductoRead.model_validate(self._buscar(uow, id))

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            self._validar_categoria(uow, data.categoria_id)
            producto = uow.productos.add(Producto.model_validate(data))
            return ProductoRead.model_validate(producto)

    # Se cambian solo los campos que vienen en el cuerpo. La descripción y la imagen se pueden borrar mandando null;
    # en los campos obligatorios el null se ignora (si no, la base lo rechaza y la API responde 500)
    def actualizar(self, id: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._buscar(uow, id)
            cambios = {
                campo: valor
                for campo, valor in data.model_dump(exclude_unset=True).items()
                if valor is not None or campo in ("descripcion", "imagen_url")
            }
            if data.categoria_id is not None:
                self._validar_categoria(uow, data.categoria_id)
            producto.sqlmodel_update(cambios)
            producto = uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def cambiar_stock(self, id: int, data: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._buscar(uow, id)
            producto.stock = data.stock
            producto.disponible = data.disponible
            producto = uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            uow.productos.delete(self._buscar(uow, id))

    def _buscar(self, uow: ProductoUnitOfWork, id: int) -> Producto:
        producto = uow.productos.get_by_id(id)
        if not producto:
            raise ProductoNoEncontrado("Producto no encontrado")
        return producto

    # get_by_id ya devuelve None si la categoría está dada de baja
    def _validar_categoria(self, uow: ProductoUnitOfWork, categoria_id: int) -> None:
        if not uow.categorias.get_by_id(categoria_id):
            raise CategoriaNoEncontrada("Categoría no encontrada")