from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository
from .repository import ProductoRepository


# Incluye categorías para validar la categoría del producto en la misma sesión
class ProductoUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.productos = ProductoRepository(self.session)
        self.categorias = CategoriaRepository(self.session)
        return self