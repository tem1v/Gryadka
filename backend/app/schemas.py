from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .models import PlotType, PlantStatus

# --- СХЕМЫ УЧАСТКА ---
class GardenPlotBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, examples=["Моя теплица"])
    type: PlotType
    location: str = Field(default="Казань")
    image_url: Optional[str] = None

class GardenPlotCreate(GardenPlotBase):
    pass

class GardenPlotResponse(GardenPlotBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- СХЕМЫ ПОЛЬЗОВАТЕЛЯ ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    first_name: str = Field(..., min_length=2)

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- СХЕМА ДЛЯ ЛОГИНА ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# --- СХЕМА ОНБОРДИНГА (Регистрация + Первый участок) ---
class OnboardingPayload(BaseModel):
    user: UserRegister
    first_plot: GardenPlotCreate


class PlantPhotoResponse(BaseModel):
    id: str
    plant_id: str
    image_url: str
    caption: Optional[str] = None
    status: Optional[str] = None
    disease_detected: Optional[str] = None
    disease_name_ru: Optional[str] = None # Будем подтягивать из БД рекомендаций
    treatment: Optional[str] = None        # Сами рекомендации для фронтенда
    confidence: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PlantResponse(BaseModel):
    id: str
    garden_plot_id: str
    name: str
    grade: str
    quantity: int
    status: str
    total_yield_amount: Optional[float]
    yield_unit: Optional[str]
    photos: List[PlantPhotoResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Схема для выдачи списка доступных ИИ-культур на фронтенд
class SupportedCropResponse(BaseModel):
    crop_name: str

class PlantCreate(BaseModel):
    garden_plot_id: str
    name: str
    grade: str
    quantity: int = 1
    status_plant: Optional[PlantStatus] = PlantStatus.planted

class PlantUpdate(BaseModel):
    name: Optional[str] = None
    grade: Optional[str] = None
    quantity: Optional[int] = None
    status_plant: Optional[PlantStatus] = None # Будет искать именно "status_plant" в JSON
    total_yield_amount: Optional[float] = None
    yield_unit: Optional[str] = None