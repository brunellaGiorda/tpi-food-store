from fastapi import APIRouter, Depends, Path
from app.core.deps import require_role
from . import service
from .schemas import UserPublic

router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios"])


@router.get("", response_model=list[UserPublic])
def listar_usuarios(_admin: UserPublic = Depends(require_role(["admin"]))):
    return service.listar()


@router.post("/{id}/activar", response_model=UserPublic)
def activar_usuario(id: int = Path(gt=0), admin: UserPublic = Depends(require_role(["admin"]))):
    return service.cambiar_estado(id, disabled=False, admin_actual=admin)


@router.post("/{id}/desactivar", response_model=UserPublic)
def desactivar_usuario(id: int = Path(gt=0), admin: UserPublic = Depends(require_role(["admin"]))):
    return service.cambiar_estado(id, disabled=True, admin_actual=admin)