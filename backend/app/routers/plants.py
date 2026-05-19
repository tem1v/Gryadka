import os
import uuid
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_user
from app.models import User, GardenPlot, Plant, PlantPhoto, PlantDiseaseRecommendation, PlantStatus
from app.schemas import PlantResponse, PlantPhotoResponse, SupportedCropResponse, PlantCreate, PlantUpdate

router = APIRouter(prefix="/plants", tags=["Plants"])


# 1. CREATE: СОЗДАНИЕ РАСТЕНИЯ
@router.post("/", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
def create_plant(
        plant_data: PlantCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Достаем параметры из пришедшей схемы plant_data
    plot = db.query(GardenPlot).filter(
        GardenPlot.id == plant_data.garden_plot_id,
        GardenPlot.user_id == current_user.id
    ).first()

    if not plot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Участок не найден или у вас нет к нему доступа"
        )

    new_plant = Plant(
        id=str(uuid.uuid4()),
        garden_plot_id=plant_data.garden_plot_id,
        name=plant_data.name,
        grade=plant_data.grade,
        quantity=plant_data.quantity,
        status=plant_data.status_plant
    )

    db.add(new_plant)
    db.commit()
    db.refresh(new_plant)

    return PlantResponse.model_validate(new_plant)


# 2. READ: ПОЛУЧИТЬ ВСЕ РАСТЕНИЯ С КОНКРЕТНОГО УЧАСТКА
@router.get("/plot/{garden_plot_id}", response_model=List[PlantResponse])
def get_plants_by_plot(
        garden_plot_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Проверяем права на участок, чтобы чужой человек не мог выкачать список растений
    plot = db.query(GardenPlot).filter(GardenPlot.id == garden_plot_id, GardenPlot.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Участок не найден")

    # Достаем растения и сразу подтягиваем их фотоальбомы (благодаря SQLAlchemy relationship)
    plants = db.query(Plant).filter(Plant.garden_plot_id == garden_plot_id).all()
    return plants


# 3. READ: ПОЛУЧИТЬ ИНФОРМАЦИЮ ОДНОГО КОНКРЕТНОГО РАСТЕНИЯ ПО ID
@router.get("/{plant_id}", response_model=PlantResponse)
def get_single_plant(
        plant_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Ищем растение через JOIN с участками для проверки безопасности
    plant = db.query(Plant).join(GardenPlot).filter(
        Plant.id == plant_id,
        GardenPlot.user_id == current_user.id
    ).first()

    if not plant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Растение не найдено")

    return plant


# 4. UPDATE: ОБНОВЛЕНИЕ ДАННЫХ РАСТЕНИЯ (Имя, Сорт, Статус, Урожайность)
@router.put("/{plant_id}", response_model=PlantResponse)
def update_plant(
    plant_id: str,
    plant_data: PlantUpdate, # <--- ТЕПЕРЬ ВСЁ ПРИЛЕТАЕТ В JSON-ТЕЛО
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ищем растение
    plant = db.query(Plant).join(GardenPlot).filter(
        Plant.id == plant_id,
        GardenPlot.user_id == current_user.id
    ).first()

    if not plant:
        raise HTTPException(status_code=404, detail="Растение не найдено")

    # Проверяем каждое поле из пришедшего JSON
    if plant_data.name is not None:
        plant.name = plant_data.name
    if plant_data.grade is not None:
        plant.grade = plant_data.grade
    if plant_data.quantity is not None:
        plant.quantity = plant_data.quantity
    if plant_data.status_plant is not None:
        plant.status = plant_data.status_plant # Пишем в поле .status модели
    if plant_data.total_yield_amount is not None:
        plant.total_yield_amount = plant_data.total_yield_amount
    if plant_data.yield_unit is not None:
        plant.yield_unit = plant_data.yield_unit

    db.commit()
    db.refresh(plant)
    return plant


# 5. DELETE: УДАЛЕНИЕ РАСТЕНИЯ (С каскадным удалением фото из БД)
@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plant(
        plant_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    plant = db.query(Plant).join(GardenPlot).filter(
        Plant.id == plant_id,
        GardenPlot.user_id == current_user.id
    ).first()

    if not plant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Растение не найдено")

    # Обрати внимание: файлы картинок с жесткого диска для этого растения
    # лучше удалять в эндпоинте удаления конкретного фото, либо пройтись циклом по plant.photos перед удалением.
    # Так как у нас настроен cascade="all, delete-orphan", из БД строки удалятся автоматически.

    db.delete(plant)
    db.commit()
    return None

# 1. ПОЛУЧИТЬ СПИСОК КУЛЬТУР, ДЛЯ КОТОРЫХ ЕСТЬ ИИ-МОДЕЛИ
@router.get("/ai-supported-crops", response_model=List[SupportedCropResponse])
def get_ai_supported_crops(db: Session = Depends(get_db)):
    # Выбираем уникальные имена культур из нашей базы знаний рекомендаций
    crops = db.query(PlantDiseaseRecommendation.crop_name).distinct().all()
    return [{"crop_name": c[0]} for c in crops]


# 2. ДОБАВИТЬ ФОТО В АЛЬБОМ РАСТЕНИЯ
@router.post("/{plant_id}/photos", response_model=PlantPhotoResponse)
async def add_photo_to_album(
        plant_id: str,
        caption: Optional[str] = Form(None),
        status_photo: Optional[str] = Form("Здоровое"),
        file: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    plant = db.query(Plant).join(GardenPlot).filter(Plant.id == plant_id, GardenPlot.user_id == current_user.id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Растение не найдено")

    # Сохраняем файл
    file_extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"images/plots/{filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_photo = PlantPhoto(
        id=str(uuid.uuid4()),
        plant_id=plant_id,
        image_url=f"/images/plots/{filename}",
        caption=caption,
        status=status_photo
    )
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)
    return new_photo


# 3. ЗАПУСК ИИ-ДИАГНОСТИКИ ДЛЯ СНИМКА
@router.post("/photos/{photo_id}/analyze", response_model=PlantPhotoResponse)
def analyze_photo(
        photo_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Ищем фото и проверяем владельца
    photo = db.query(PlantPhoto).join(Plant).join(GardenPlot).filter(
        PlantPhoto.id == photo_id, GardenPlot.user_id == current_user.id
    ).first()

    if not photo:
        raise HTTPException(status_code=404, detail="Фотография не найдена")

    crop_name = photo.plant.name  # Узнаем культуру (например, "Томат")

    # Проверяем, есть ли в БД рекомендации/модели для этой культуры
    has_model = db.query(PlantDiseaseRecommendation).filter(PlantDiseaseRecommendation.crop_name == crop_name).first()
    if not has_model:
        raise HTTPException(status_code=400, detail=f"Для культуры '{crop_name}' нет обученной ИИ-модели.")

    # --- ИМИТАЦИЯ ВЫЗОВА НЕЙРОСЕТИ ---
    # Нейросеть проанализировала файл photo.image_url и вернула код болезни:
    mock_disease_code = "tomato_late_blight"
    mock_confidence = 0.962
    # ---------------------------------

    # Ищем развернутые рекомендации по коду болезни из нашей БД
    rec = db.query(PlantDiseaseRecommendation).filter(
        PlantDiseaseRecommendation.disease_code == mock_disease_code).first()

    if rec:
        photo.disease_detected = rec.disease_code
        photo.confidence = mock_confidence
        photo.status = rec.disease_name_ru  # Меняем статус фото на название болезни
        db.commit()
        db.refresh(photo)

        # Маппим данные из базы рекомендаций прямо в ответ схемы для фронтенда
        response_data = PlantPhotoResponse.model_validate(photo)
        response_data.disease_name_ru = rec.disease_name_ru
        response_data.treatment = rec.treatment
        return response_data

    raise HTTPException(status_code=500, detail="Ошибка ИИ: Не найдены рекомендации для распознанной болезни.")