from pydantic import BaseModel, EmailStr, Field
from typing import Optional
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