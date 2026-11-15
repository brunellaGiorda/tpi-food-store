from sqlmodel import Session
from app.core.database import session_factory


# Unit of Work base: abre la sesión al entrar al with y al salir confirma o deshace todo junto
class UnitOfWork:
    def __enter__(self):
        self.session: Session = session_factory()
        return self

    def __exit__(self, exc_type, exc, tb):
        if exc_type is None:
            self.session.commit()
        else:
            self.session.rollback()
        self.session.close()