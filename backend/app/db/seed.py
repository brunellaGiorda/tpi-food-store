from app.core.database import create_all_tables
from app.core.security import hash_password
# Se importan todos los modelos para que SQLModel pueda armar las relaciones entre ellos
from app.modules.categorias.models import Categoria
from app.modules.pedidos.models import Pedido
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


# Se puede correr varias veces: el admin se crea solo si no existe
def crear_admin():
    with UsuarioUnitOfWork() as uow:
        if uow.usuarios.get_by_username("admin"):
            print("El usuario admin ya existe")
            return
        uow.usuarios.add(Usuario(
            username="admin",
            full_name="Administrador",
            email="admin@foodstore.com",
            hashed_password=hash_password("Admin1234!"),
            role="admin",
        ))
        print("Usuario admin creado")


if __name__ == "__main__":
    create_all_tables()
    crear_admin()