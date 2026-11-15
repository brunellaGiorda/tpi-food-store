from datetime import datetime
from sqlmodel import SQLModel


# Lo que devuelve la API sobre un usuario
class UserPublic(SQLModel):
    id: int
    username: str
    full_name: str
    email: str
    role: str
    disabled: bool
    created_at: datetime