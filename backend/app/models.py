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
    name = Column(String, nullable=False)  # Культура (Томат)
    grade = Column(String, nullable=False)  # Сорт (Черри)
    quantity = Column(Integer, nullable=False, default=1)
    status = Column(Enum(PlantStatus), nullable=False, default=PlantStatus.planted)

    total_yield_amount = Column(Float, nullable=True, default=0.0)
    yield_unit = Column(String, nullable=True, default="кг")

    image_url = Column(String, nullable=True)  # Последнее фото для ИИ
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plot = relationship("GardenPlot", back_populates="plants")