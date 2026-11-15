from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from app.core.deps import require_role
from app.modules.categorias.service import CategoriaNoEncontrada
from .schemas import ProductoCreate, ProductoRead, ProductosPaginados, ProductoStockUpdate, ProductoUpdate
from .service import ProductoNoEncontrado, ProductoService
from .unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["Productos"])

solo_admin = [Depends(require_role(["admin"]))]


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    categoria_id: Optional[int] = None,
    disponible: Optional[bool] = None,
    service: ProductoService = Depends(get_producto_service),
):
    return service.listar(skip, limit, search, categoria_id, disponible)


@router.get("/{id}", response_model=ProductoRead)
def detalle_producto(id: int = Path(gt=0), service: ProductoService = Depends(get_producto_service)):
    try:
        return service.obtener(id)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED, dependencies=solo_admin)
def crear_producto(data: ProductoCreate, service: ProductoService = Depends(get_producto_service)):
    try:
        return service.crear(data)
    except CategoriaNoEncontrada as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{id}", response_model=ProductoRead, dependencies=solo_admin)
def actualizar_producto(data: ProductoUpdate, id: int = Path(gt=0), service: ProductoService = Depends(get_producto_service)):
    try:
        return service.actualizar(id, data)
    except (ProductoNoEncontrado, CategoriaNoEncontrada) as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/{id}/stock", response_model=ProductoRead, dependencies=solo_admin)
def cambiar_stock(data: ProductoStockUpdate, id: int = Path(gt=0), service: ProductoService = Depends(get_producto_service)):
    try:
        return service.cambiar_stock(id, data)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=solo_admin)
def eliminar_producto(id: int = Path(gt=0), service: ProductoService = Depends(get_producto_service)):
    try:
        service.eliminar(id)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))