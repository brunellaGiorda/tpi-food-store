from sqlmodel import SQLModel, Session, create_engine
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)


# Crea las tablas de todos los modelos que estén importados
def create_all_tables():
    SQLModel.metadata.create_all(engine)


# Cada Unit of Work pide una sesión nueva con esta función
def session_factory() -> Session:
    return Session(engine)