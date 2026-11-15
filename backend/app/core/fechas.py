from datetime import datetime, timezone


# Fecha y hora actual con zona horaria (UTC): SQLModel no acepta fechas sin zona
def ahora() -> datetime:
    return datetime.now(timezone.utc)