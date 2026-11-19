from app.core.database import create_all_tables
from app.core.security import hash_password
# Se importan todos los modelos para que SQLModel pueda armar las relaciones entre ellos
from app.modules.categorias.models import Categoria
from app.modules.pedidos.models import Pedido
from app.modules.productos.models import Producto
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

# Categorías con sus productos: (nombre, descripción, precio, stock, URL de la imagen)
CATALOGO = {
    "Pizzas": [
        ("Muzzarella", "Salsa de tomate, muzzarella y aceitunas", 9500, 20,
         "https://acdn-us.mitiendanube.com/stores/001/664/252/products/4e475ddf-2c43-4d47-b69c-990a92e91029-26f258f7fdb6a2b9fb16276674103675-1024-1024.webp"),
        ("Napolitana", "Muzzarella, rodajas de tomate y ajo", 10500, 15,
         "https://acdn-us.mitiendanube.com/stores/001/664/252/products/a2408019-e602-43f0-8495-1e081f54cf59-97011d32d06882ec1016276673747101-1024-1024.webp"),
        ("Fugazzeta", "Cebolla y muzzarella", 10000, 15,
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRGnrX8LDkUGp16rACuUXbgvPGtDq-p0ETH646Xe2yUxyXjyQ0c564iv4&s=10"),
    ],
    "Empanadas": [
        ("Empanada de carne", "Carne cortada a cuchillo", 1500, 60,
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZBUj8GfIBC6oosR2xN1DNEy-EdfEwb6EnYeJvmG8I_e5CbxtTqWP_6xCr&s=10"),
        ("Empanada de jamón y queso", "Jamón cocido y muzzarella", 1400, 60,
         "https://media.tycsports.com/files/2025/08/28/877225/empanadas-de-jamon-y-queso_862x485.webp"),
        ("Empanada de pollo", "Pollo, cebolla y morrón", 1400, 40,
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDdwLvd38rFZbCVtm07x-CUgGlMgUsn4chjgaZ1h3ckLp2JoEsoLfolIY&s=10"),
    ],
    "Sándwiches": [
        ("Lomito completo", "Lomo, jamón, queso, huevo, lechuga y tomate", 12000, 15,
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiy96ajT59lYlnaWGXKwVJXsu7OCW_CNFri-V3OLc1RQ&s=10"),
        ("Hamburguesa clásica", "Carne, cheddar, lechuga y tomate", 9000, 20,
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2_HC7DT48kC5ktHq-OaHuUxBBX4KzFnzL0sTbvlEX3A&s=10"),
    ],
    "Bebidas": [
        ("Coca-Cola 1,5 L", "Gaseosa sabor cola", 3500, 30,
         "https://www.farmaciassanchezantoniolli.com.ar/18602-medium_default/gaseosa-coca-cola-x-15l.jpg"),
        ("Sprite 1,5 L", "Gaseosa sabor lima-limón", 3500, 20,
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzAUfeCmI_hUTD4fRU-ErDpHMVg5YgG617ONDXjsCYdDG0kh3Xb0kGCVQ&s=10"),
        ("Agua mineral 500 ml", "Sin gas", 1500, 30,
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2UW-zmknqWz6YF75DlATbC038wtlEN22o9i5bNOipOg&s=10"),
        ("Jugo de naranja 1 L", "Exprimido", 2500, 25,
         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs71aJ_P5CNLu_TPBWz03HIXlAay_XYvwtaShc7W_ngimSdh9Ue3DpsRI&s=10"),
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
            for nombre, descripcion, precio, stock, imagen_url in productos:
                uow.productos.add(Producto(
                    categoria_id=categoria.id,  # type: ignore[arg-type]
                    nombre=nombre,
                    descripcion=descripcion,
                    precio_base=precio,
                    stock=stock,
                    imagen_url=imagen_url,
                ))
        print("Catálogo creado")


if __name__ == "__main__":
    create_all_tables()
    crear_admin()
    crear_catalogo()