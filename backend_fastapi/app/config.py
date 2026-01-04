from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGO_URI: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days
    FRONTEND_URL: str = "http://localhost:3000"
    SECRET_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()
