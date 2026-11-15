from pydantic import EmailStr
from sqlmodel import Field, SQLModel


# Lo que manda el frontend al registrarse.
class UserCreate(SQLModel):
    model_config = {"str_strip_whitespace": True}

    username: str = Field(min_length=3, max_length=50)
    full_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)


class MensajeRespuesta(SQLModel):
    message: str