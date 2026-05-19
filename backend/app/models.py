import enum
from sqlalchemy import Column, String, Integer, ForeignKey, Enum, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


# Перечисления для жесткой типизации на уровне БД
class PlotType(str, enum.Enum):
    greenhouse = "greenhouse"
    open_ground = "open_ground"
    home = "home"


class PlantStatus(str, enum.Enum):
    seedling = "seedling"
    planted = "planted"
    fruiting = "fruiting"
    sick = "sick"
    removed = "removed"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # UUID в виде строки
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plots = relationship("GardenPlot", back_populates="owner", cascade="all, delete-orphan")


class GardenPlot(Base):
    __tablename__ = "garden_plots"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(Enum(PlotType), nullable=False, default=PlotType.open_ground)
    location = Column(String, nullable=False, default="Казань")
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="plots")
    plants = relationship("Plant", back_populates="plot", cascade="all, delete-orphan")


class Plant(Base):
    __tablename__ = "plants"

    id = Column(String, primary_key=True, index=True)
    garden_plot_id = Column(String, ForeignKey("garden_plots.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)  # Культура (например, "Томат")
    grade = Column(String, nullable=False)  # Сорт (например, "Черри")
    quantity = Column(Integer, nullable=False, default=1)
    status = Column(Enum(PlantStatus), nullable=False, default=PlantStatus.planted)

    total_yield_amount = Column(Float, nullable=True, default=0.0)
    yield_unit = Column(String, nullable=True, default="кг")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plot = relationship("GardenPlot", back_populates="plants")
    # Связь с фотоальбомом
    photos = relationship("PlantPhoto", back_populates="plant", cascade="all, delete-orphan")


class PlantPhoto(Base):
    __tablename__ = "plant_photos"

    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)

    # Твои новые поля: подпись и статус фотографии
    caption = Column(String, nullable=True)  # Описание от пользователя (например, "Первые всходы")
    status = Column(String, nullable=True)  # Статус на фото (например, "Подозрение на болезнь", "Здоровое")

    # Результаты ИИ-диагностики
    disease_detected = Column(String, nullable=True)  # Техническое имя болезни из нейросети
    confidence = Column(Float, nullable=True)  # Точность ИИ (0.0 - 1.0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plant = relationship("Plant", back_populates="photos")


class PlantDiseaseRecommendation(Base):
    __tablename__ = "plant_disease_recommendations"

    id = Column(String, primary_key=True, index=True)
    crop_name = Column(String, nullable=False, index=True)  # Для какого растения модель (Томат, Огурец)
    disease_code = Column(String, nullable=False, unique=True)  # Что возвращает ИИ (tomato_late_blight)
    disease_name_ru = Column(String, nullable=False)  # Человеческое название (Фитофтороз томатов)
    description = Column(String, nullable=False)  # Симптомы и описание болезни
    treatment = Column(String, nullable=False)