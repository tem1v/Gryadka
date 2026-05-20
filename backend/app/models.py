import enum
from sqlalchemy import Column, String, Integer, ForeignKey, Enum, DateTime, Float, Boolean, Date, Time, func
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


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
    harvested = "harvested"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # UUID в виде строки
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plots = relationship("GardenPlot", back_populates="owner", cascade="all, delete-orphan")
    inventory_items = relationship("InventoryItem", back_populates="user", cascade="all, delete-orphan")

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
    name = Column(String, nullable=False)
    grade = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    status = Column(Enum(PlantStatus), nullable=False, default=PlantStatus.planted)
    season_archive_id = Column(String, ForeignKey("season_archives.id", ondelete="SET NULL"), nullable=True)

    total_yield_amount = Column(Float, nullable=True, default=0.0)
    yield_unit = Column(String, nullable=True, default="кг")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plot = relationship("GardenPlot", back_populates="plants")
    photos = relationship("PlantPhoto", back_populates="plant", cascade="all, delete-orphan")
    archive = relationship("SeasonArchive", back_populates="plants")


class PlantPhoto(Base):
    __tablename__ = "plant_photos"

    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)

    caption = Column(String, nullable=True)
    status = Column(String, nullable=True)

    # Результаты ИИ-диагностики
    disease_detected = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plant = relationship("Plant", back_populates="photos")


class PlantDiseaseRecommendation(Base):
    __tablename__ = "plant_disease_recommendations"

    id = Column(String, primary_key=True, index=True)
    crop_name = Column(String, nullable=False, index=True)
    disease_code = Column(String, nullable=False, unique=True)
    disease_name_ru = Column(String, nullable=False)
    description = Column(String, nullable=False)
    treatment = Column(String, nullable=False)

class ItemType(str, enum.Enum):
    tool = "tool"
    seeds = "seeds"
    fertilizer = "fertilizer"

class InventoryItem(Base):
    __tablename__ = "inventory"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    name = Column(String, nullable=False)
    item_type = Column(Enum(ItemType), nullable=False, default=ItemType.tool)
    quantity = Column(Integer, nullable=False, default=1)
    location = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="inventory_items")


class TaskTag(str, enum.Enum):
    watering = "watering"
    weeding = "weeding"
    fertilizing = "fertilizing"
    harvest = "harvest"
    planting = "planting"
    other = "other"


class GardenTask(Base):
    __tablename__ = "garden_tasks"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    garden_plot_id = Column(String, ForeignKey("garden_plots.id", ondelete="CASCADE"), nullable=False)

    plant_name = Column(String, nullable=True)
    plant_grade = Column(String, nullable=True)
    location = Column(String, nullable=True)
    task_tag = Column(Enum(TaskTag), nullable=False, default=TaskTag.other)

    task_date = Column(Date, nullable=False)
    task_time = Column(Time, nullable=True)

    send_email_notification = Column(Boolean, default=False)
    is_completed = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    plot = relationship("GardenPlot")


class SeasonArchive(Base):
    __tablename__ = "season_archives"

    id = Column(String, primary_key=True, index=True)
    garden_plot_id = Column(String, ForeignKey("garden_plots.id", ondelete="CASCADE"), nullable=False)

    name = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plot = relationship("GardenPlot")
    plants = relationship("Plant", back_populates="archive")

