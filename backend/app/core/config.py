from pydantic_settings import BaseSettings, SettingsConfigDict


# Lee las variables del archivo .env --> si falta una obligatoria, la app no arranca
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_ORIGIN: str = "http://localhost:5173"


settings = Settings()  # type: ignore[call-arg]