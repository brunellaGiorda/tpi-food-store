# tpi-food-store

Trabajo Práctico Integrador de Programación IV: sistema de pedidos de comida con backend FastAPI + SQLModel y frontend React + TypeScript.

## Decisiones

### Backend

- Se usa Python 3.14 con SQLModel 0.0.48, que es compatible con esa versión de Python.
- `DATABASE_URL` tiene que empezar con `postgresql+psycopg2://`. Si empieza solo con `postgresql://`, SQLModel busca otro driver (`psycopg` 3) que no está instalado.
- La baja lógica se resuelve en el repositorio base: `delete` pone `activo = False`, y `get_by_id` y `get_all` ignoran los registros dados de baja.
- En el registro se sacan los espacios al principio y al final de los textos (`str_strip_whitespace`), para que `" maria "` y `"maria"` no cuenten como usuarios distintos.
