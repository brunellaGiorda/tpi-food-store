from app.core.database import create_all_tables
from app.core.security import hash_password
# Se importan todos los modelos para que SQLModel pueda armar las relaciones entre ellos
from app.modules.categorias.models import Categoria
from app.modules.pedidos.models import Pedido
from app.modules.productos.models import Producto
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

# Categorías con sus productos: (nombre, descripción, precio, stock)
CATALOGO = {
    "Pizzas": [
        ("Muzzarella", "Salsa de tomate, muzzarella y aceitunas", 9500, 20),
        ("Napolitana", "Muzzarella, rodajas de tomate y ajo", 10500, 15),
        ("Fugazzeta", "Cebolla y muzzarella", 10000, 15),
    ],
    "Empanadas": [
        ("Empanada de carne", "Carne cortada a cuchillo", 1500, 60),
        ("Empanada de jamón y queso", "Jamón cocido y muzzarella", 1400, 60),
        ("Empanada de pollo", "Pollo, cebolla y morrón", 1400, 40),
    ],
    "Bebidas": [
        ("Gaseosa 1,5 L", "Línea Coca-Cola", 3500, 30),
        ("Agua mineral 500 ml", "Sin gas", 1500, 30),
    ],
}


# Se puede correr varias veces: cada cosa se crea solo si no existe
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


def crear_catalogo():
    with ProductoUnitOfWork() as uow:
        if uow.productos.get_all():
            print("El catálogo ya tiene productos")
            return
        for nombre_categoria, productos in CATALOGO.items():
            categoria = uow.categorias.get_by_nombre(nombre_categoria)
            if not categoria:
                categoria = uow.categorias.add(Categoria(nombre=nombre_categoria))
            for nombre, descripcion, precio, stock in productos:
                uow.productos.add(Producto(
                    categoria_id=categoria.id,  # type: ignore[arg-type]
                    nombre=nombre,
                    descripcion=descripcion,
                    precio_base=precio,
                    stock=stock,
                ))
        print("Catálogo creado")


if __name__ == "__main__":
    create_all_tables()
    crear_admin()
    crear_catalogo()