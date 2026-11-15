from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from app.core.fechas import ahora


class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(max_length=50, unique=True, index=True)
    full_name: str = Field(max_length=100)
    email: str = Field(max_length=254, unique=True, index=True)
    hashed_password: str
    role: str = Field(default="user")  # "user" o "admin"
    disabled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=ahora)