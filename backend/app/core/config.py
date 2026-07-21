import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="postgresql://postgres:postgres@localhost:5432/postgres", validation_alias="DATABASE_URL")
    SUPABASE_URL: str = Field(default="https://placeholder.supabase.co", validation_alias="SUPABASE_URL")
    SUPABASE_KEY: str = Field(default="placeholder_key", validation_alias="SUPABASE_KEY")
    SUPABASE_JWT_SECRET: str = Field(default="placeholder_jwt_secret", validation_alias="SUPABASE_JWT_SECRET")
    PINECONE_API_KEY: str = Field(default="placeholder_pinecone_key", validation_alias="PINECONE_API_KEY")
    PINECONE_INDEX_NAME: str = Field(default="ssb-knowledge-base", validation_alias="PINECONE_INDEX_NAME")
    GEMINI_API_KEY: str = Field(default="placeholder_gemini_key", validation_alias="GEMINI_API_KEY")
    OPENROUTER_API_KEY: str = Field(default="", validation_alias="OPENROUTER_API_KEY")
    GROQ_API_KEY: str = Field(default="", validation_alias="GROQ_API_KEY")
    PORT: int = Field(default=8000, validation_alias="PORT")
    ENV: str = Field(default="development", validation_alias="ENV")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
