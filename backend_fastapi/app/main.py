from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routes import auth, profiles, qr, orders, analytics, admin

app = FastAPI(
    title="TapOnn Backend API",
    description="Complete backend for TapOnn digital profile platform",
    version="1.0.0",
)

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5173",
    settings.FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def start_db():
    await init_db()

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Welcome to TapOnn API (FastAPI)",
        "version": "1.0.0",
        "database": "MongoDB",
        "docs": "/docs"
    }

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "success",
        "message": "TapOnn API is running",
        "version": "1.0.0"
    }

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["Profiles"])
app.include_router(qr.router, prefix="/api/qr", tags=["QR Codes"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
