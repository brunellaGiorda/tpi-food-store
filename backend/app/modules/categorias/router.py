from fastapi import APIRouter, Depends, HTTPException, Path, status
from app.core.deps import require_role
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .service import CategoriaNoEncontrada, CategoriaService, NombreDuplicado
from .unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["Categorías"])

solo_admin = [Depends(require_role(["admin"]))]


# Cada pedido recibe un Service nuevo con su propio Unit of Work
def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: CategoriaService = Depends(get_categoria_service)):
    return service.listar()


@router.get("/{id}", response_model=CategoriaRead)
def detalle_categoria(id: int = Path(gt=0), service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.obtener(id)
    except CategoriaNoEncontrada as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED, dependencies=solo_admin)
def crear_categoria(data: CategoriaCreate, service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.crear(data)
    except NombreDuplicado as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.put("/{id}", response_model=CategoriaRead, dependencies=solo_admin)
def actualizar_categoria(data: CategoriaUpdate, id: int = Path(gt=0), service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.actualizar(id, data)
    except CategoriaNoEncontrada as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except NombreDuplicado as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=solo_admin)
def eliminar_categoria(id: int = Path(gt=0), service: CategoriaService = Depends(get_categoria_service)):
    try:
        service.eliminar(id)
    except CategoriaNoEncontrada as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))