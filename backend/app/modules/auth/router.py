from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.deps import get_current_active_user
from app.modules.usuarios.schemas import UserPublic
from . import service
from .schemas import MensajeRespuesta, UserCreate

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def registrar(data: UserCreate):
    return service.registrar(data)


# Login con formulario OAuth2 (username y password): el JWT queda en una cookie HttpOnly, no en el cuerpo
@router.post("/token", response_model=MensajeRespuesta)
def login(response: Response, form: OAuth2PasswordRequestForm = Depends()):
    token = service.autenticar(form.username, form.password)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,  # JavaScript no la puede leer
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # vence junto con el token
        samesite="lax",
        secure=False,  # con HTTPS iría en True
    )
    return {"message": "Login exitoso"}


# Responde con un Set-Cookie que borra la cookie en el navegador
@router.post("/logout", response_model=MensajeRespuesta)
def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, samesite="lax", secure=False)
    return {"message": "Sesión cerrada"}


@router.get("/me", response_model=UserPublic)
def me(usuario: UserPublic = Depends(get_current_active_user)):
    return usuario