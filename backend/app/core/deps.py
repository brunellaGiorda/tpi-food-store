from typing import List, Optional
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


# Lee el token de la cookie, no del header Authorization
class OAuth2PasswordBearerWithCookie(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> Optional[str]:
        token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No autenticado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return token


oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/api/v1/auth/token")


# Valida el token y busca al usuario. Sin sesión válida --> 401
def get_current_user(token: str = Depends(oauth2_scheme)) -> UserPublic:
    credenciales_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas o sesión vencida",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None or payload.get("sub") is None:
        raise credenciales_invalidas

    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get_by_username(payload["sub"])
        if usuario is None:
            raise credenciales_invalidas
        return UserPublic.model_validate(usuario)


# Usuario desactivado --> 400
def get_current_active_user(usuario: UserPublic = Depends(get_current_user)) -> UserPublic:
    if usuario.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cuenta de usuario desactivada")
    return usuario


# require_role(["admin"]) --> solo deja pasar a esos roles; si no, 403
def require_role(roles: List[str]):
    def verificar_rol(usuario: UserPublic = Depends(get_current_active_user)) -> UserPublic:
        if usuario.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tenés permisos para esta operación")
        return usuario

    return verificar_rol