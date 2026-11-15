from fastapi import HTTPException, status
from .schemas import UserPublic
from .unit_of_work import UsuarioUnitOfWork


def listar() -> list[UserPublic]:
    with UsuarioUnitOfWork() as uow:
        return [UserPublic.model_validate(u) for u in uow.usuarios.get_all()]


# Activar o desactivar es la baja lógica del usuario. Si ya estaba así, responde 200 igual.
def cambiar_estado(id: int, disabled: bool, admin_actual: UserPublic) -> UserPublic:
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get_by_id(id)
        if not usuario:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
        if disabled and usuario.id == admin_actual.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No podés desactivar tu propia cuenta")
        usuario.disabled = disabled
        usuario = uow.usuarios.add(usuario)
        return UserPublic.model_validate(usuario)