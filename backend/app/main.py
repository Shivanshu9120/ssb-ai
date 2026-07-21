from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import user, chat, usage, admin
from app.database.connection import engine
from sqlmodel import SQLModel

app = FastAPI(
    title="SSB Mentor AI API",
    description="Core backend orchestrator for SSB Mentor AI.",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(usage.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENV,
        "version": "1.0.0"
    }

@app.on_event("startup")
def on_startup():
    # Attempt local table creation fallback if the user is running a custom Postgres server.
    # Supabase projects will already have tables created via the SQL Editor schema scripts.
    try:
        SQLModel.metadata.create_all(engine)
        print("Database tables initialized/verified.")
    except Exception as e:
        print(f"Database initialization alert (could be using managed Supabase schema): {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
