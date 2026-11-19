# tpi-food-store

Trabajo Práctico Integrador de Programación IV: sistema de pedidos de comida con backend FastAPI + SQLModel y frontend React + TypeScript.

Repositorio: https://github.com/brunellaGiorda/tpi-food-store

## Requisitos

- Python 3.11 o superior (se desarrolló con 3.14)
- PostgreSQL 15 o superior
- Node.js 20.19 o superior
- pnpm 9 o superior

## Backend

### Instalación y ejecución

1. Crear en PostgreSQL una base vacía llamada `foodstore_db`.
2. Desde la carpeta `backend/`, crear el entorno virtual e instalar las dependencias:
   ```
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```
   En macOS o Linux el entorno se activa con `source .venv/bin/activate`.
3. Copiar `.env.example` como `.env` y completar la contraseña de PostgreSQL en `DATABASE_URL` y una `SECRET_KEY`.
4. Cargar los datos iniciales y levantar la API:
   ```
   python -m app.db.seed
   uvicorn app.main:app --reload
   ```

La documentación queda en http://localhost:8000/docs y http://localhost:8000/redoc.

### Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql+psycopg2://postgres:CONTRASEÑA@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Clave para firmar los JWT (mínimo 32 caracteres) | se genera con `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración de la sesión | `30` |
| `FRONTEND_ORIGIN` | Origen del frontend permitido por CORS | `http://localhost:5173` |

### Datos iniciales

`python -m app.db.seed` crea el usuario administrador, 3 categorías y 8 productos con stock. Se puede correr más de una vez sin duplicar datos.

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234!` | admin |

Los clientes se crean desde el registro.

## Frontend

### Instalación y ejecución

Con la API ya levantada:

1. Desde la carpeta `frontend/`, instalar las dependencias:
   ```
   pnpm install
   ```
2. Copiar `.env.example` como `.env`. El valor que trae ya apunta a la API local.
3. Levantar la aplicación:
   ```
   pnpm dev
   ```

La aplicación queda en http://localhost:5173. Para verificar los tipos y generar la versión final se usa `pnpm build`.

### Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | Dirección de la API, con el prefijo `/api/v1` | `http://localhost:8000/api/v1` |

## Decisiones

### Backend

- Se usa Python 3.14 con SQLModel 0.0.48, que es compatible con esa versión de Python.
- `DATABASE_URL` tiene que empezar con `postgresql+psycopg2://`. Si empieza solo con `postgresql://`, SQLModel busca otro driver (`psycopg` 3) que no está instalado.
- Las tablas toman el nombre de la clase en minúscula, que es lo que hace SQLModel por defecto (por ejemplo, `DetallePedido` → `detallepedido`). Si hiciera falta otro nombre, se puede definir en el modelo con `__tablename__ = "detalle_pedido"`.
- Los `# type: ignore[...]` solo ocultan avisos de VS Code que no son errores reales (por ejemplo, que un `id` podría ser `None` o que `Settings()` no recibe argumentos porque los lee del `.env`). No cambian cómo funciona el código.
- La baja lógica se resuelve en el repositorio base: `delete` pone `activo = False`, y `get_by_id` y `get_all` ignoran los registros dados de baja.
- En el registro se sacan los espacios al principio y al final de los textos (`str_strip_whitespace`), para que `" maria "` y `"maria"` no cuenten como usuarios distintos.
- El nombre de una categoría es único sin distinguir mayúsculas: si existe "Bebidas", no se puede crear "bebidas". Los productos no tienen nombre único, porque la consigna no lo pide.
- La búsqueda de productos no distingue mayúsculas, como pide la consigna, pero sí tildes: "milanesa" no encuentra "Milanésa". Para ignorar también las tildes se podría usar la extensión `unaccent` de PostgreSQL.

### Frontend

- `src/vite-env.d.ts` declara `VITE_API_URL` como `string`. Sin ese archivo, Vite toma las variables del `.env` como `any`.
- El formulario de checkout está dentro de `CheckoutPage` y no en un componente aparte, igual que los de login y registro: se usa en una sola pantalla, así que separarlo no agregaba nada.
- "Mis pedidos" es solo para los clientes. `GET /pedidos` le devuelve al admin los pedidos de todos, así que el admin los ve y los gestiona en Panel -- Pedidos (incluidos los que hace él). Si entra a `/mis-pedidos`, se lo redirige ahí.
- El panel de administración tiene un menú propio (`shared/layout/AdminLayout.tsx`) para moverse entre sus cinco pantallas. En la Navbar queda un solo link, "Panel", visible solo para el admin.
- Las tablas del panel usan un componente común, `shared/components/Tabla.tsx`, que recibe la tabla armada con TanStack Table en cada página.
- En el ABM de productos el stock y la disponibilidad se cambian con el botón "Stock", que usa `PATCH /productos/{id}/stock`. Al crear un producto se carga el stock inicial; al editarlo, no.
