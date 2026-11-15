from fastapi import HTTPException, status
from app.core.security import create_access_token, hash_password, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from .schemas import UserCreate


# El registro es público y siempre crea usuarios con rol "user"
def registrar(data: UserCreate) -> UserPublic:
    with UsuarioUnitOfWork() as uow:
        if uow.usuarios.get_by_username(data.username):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El nombre de usuario ya está en uso")
        if uow.usuarios.get_by_email(data.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El email ya está registrado")
        usuario = Usuario(
            username=data.username,
            full_name=data.full_name,
            email=data.email,
            hashed_password=hash_password(data.password),
            role="user",
        )
        usuario = uow.usuarios.add(usuario)
        return UserPublic.model_validate(usuario)


# Valida las credenciales y devuelve el JWT. El router lo pone en la cookie.
def autenticar(username: str, password: str) -> str:
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get_by_username(username)
        # Mismo mensaje si falla el usuario o la contraseña --> no se revela qué usuarios existen
        if not usuario or not verify_password(password, usuario.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario o contraseña incorrectos")
        if usuario.disabled:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cuenta de usuario desactivada")
        return create_access_token({"sub": usuario.username, "role": usuario.role})