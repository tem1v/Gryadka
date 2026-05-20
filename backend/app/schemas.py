from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from .models import PlotType, PlantStatus
from .models import ItemType
from datetime import datetime, date, time
from .models import TaskTag

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


class UserLogin(BaseModel):
    email: EmailStr
    password: str


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
    disease_name_ru: Optional[str] = None
    treatment: Optional[str] = None
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
    status_plant: Optional[PlantStatus] = None
    total_yield_amount: Optional[float] = None
    yield_unit: Optional[str] = None

class InventoryItemCreate(BaseModel):
    name: str
    item_type: ItemType
    quantity: int = 1
    location: Optional[str] = None

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    item_type: Optional[ItemType] = None
    quantity: Optional[int] = None
    location: Optional[str] = None

class InventoryItemResponse(BaseModel):
    id: str
    user_id: str
    name: str
    item_type: ItemType
    quantity: int
    location: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    garden_plot_id: str
    plant_name: Optional[str] = None
    plant_grade: Optional[str] = None
    location: Optional[str] = None
    task_tag: TaskTag = TaskTag.other
    task_date: date
    task_time: Optional[time] = None
    send_email_notification: bool = False


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    garden_plot_id: Optional[str] = None
    plant_name: Optional[str] = None
    plant_grade: Optional[str] = None
    location: Optional[str] = None
    task_tag: Optional[TaskTag] = None
    task_date: Optional[date] = None
    task_time: Optional[time] = None
    send_email_notification: Optional[bool] = None
    is_completed: Optional[bool] = None


class TaskResponse(TaskBase):
    id: str
    user_id: str
    is_completed: bool
    is_overdue: bool = False
    created_at: datetime

    @classmethod
    def model_validate(cls, obj, **kwargs):
        is_completed = getattr(obj, "is_completed", False)
        task_date = getattr(obj, "task_date", date.today())

        is_overdue = False
        if not is_completed:
            if task_date < date.today():
                is_overdue = True
            elif task_date == date.today() and getattr(obj, "task_time", None) is not None:
                if obj.task_time < datetime.now().time():
                    is_overdue = True

        instance = super().model_validate(obj, **kwargs)
        instance.is_overdue = is_overdue
        return instance

    class Config:
        from_attributes = True

class SeasonArchiveCreate(BaseModel):
    name: str

class SeasonArchiveResponse(BaseModel):
    id: str
    garden_plot_id: str
    name: str
    start_date: date
    end_date: date
    created_at: datetime
    plants: List[PlantResponse] = []

    class Config:
        from_attributes = True
