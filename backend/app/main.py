from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, plots, plants
from fastapi.staticfiles import StaticFiles
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Garden Manager API",
    description="Бэкенд системы управления участками и контроля здоровья растений с ИИ",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(plots.router, prefix="/api")
app.include_router(plants.router, prefix="/api")

if not os.path.exists("images/plots"):
    os.makedirs("images/plots")

app.mount("/images", StaticFiles(directory="images"), name="images")
@app.get("/")
def root():
    return {"status": "ok", "message": "Garden Manager API работает стабильно"}