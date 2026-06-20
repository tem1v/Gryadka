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


@router.post("/", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
def create_plant(
        plant_data: PlantCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
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


@router.get("/plot/{garden_plot_id}", response_model=List[PlantResponse])
def get_plants_by_plot(
        garden_plot_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    plot = db.query(GardenPlot).filter(GardenPlot.id == garden_plot_id, GardenPlot.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Участок не найден")

    plants = db.query(Plant).filter(
        Plant.garden_plot_id == garden_plot_id,
        Plant.season_archive_id == None
    ).all()
    return plants


@router.get("/{plant_id}", response_model=PlantResponse)
def get_single_plant(
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

    return plant


@router.put("/{plant_id}", response_model=PlantResponse)
def update_plant(
    plant_id: str,
    plant_data: PlantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plant = db.query(Plant).join(GardenPlot).filter(
        Plant.id == plant_id,
        GardenPlot.user_id == current_user.id
    ).first()

    if not plant:
        raise HTTPException(status_code=404, detail="Растение не найдено")

    if plant_data.name is not None:
        plant.name = plant_data.name
    if plant_data.grade is not None:
        plant.grade = plant_data.grade
    if plant_data.quantity is not None:
        plant.quantity = plant_data.quantity
    if plant_data.status_plant is not None:
        plant.status = plant_data.status_plant
    if plant_data.total_yield_amount is not None:
        plant.total_yield_amount = plant_data.total_yield_amount
    if plant_data.yield_unit is not None:
        plant.yield_unit = plant_data.yield_unit

    db.commit()
    db.refresh(plant)
    return plant


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


    db.delete(plant)
    db.commit()
    return None

@router.get("/ai-supported-crops", response_model=List[SupportedCropResponse])
def get_ai_supported_crops(db: Session = Depends(get_db)):
    crops = db.query(PlantDiseaseRecommendation.crop_name).distinct().all()
    return [{"crop_name": c[0]} for c in crops]


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

    file_extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"images/plants/{filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_photo = PlantPhoto(
        id=str(uuid.uuid4()),
        plant_id=plant_id,
        image_url=f"/images/plants/{filename}",
        caption=caption,
        status=status_photo
    )
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)
    return new_photo


@router.post("/photos/{photo_id}/analyze", response_model=PlantPhotoResponse)
def analyze_photo(
        photo_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    photo = db.query(PlantPhoto).join(Plant).join(GardenPlot).filter(
        PlantPhoto.id == photo_id, GardenPlot.user_id == current_user.id
    ).first()

    if not photo:
        raise HTTPException(status_code=404, detail="Фотография не найдена")

    crop_name = photo.plant.name

    has_model = db.query(PlantDiseaseRecommendation).filter(PlantDiseaseRecommendation.crop_name == crop_name).first()
    if not has_model:
        raise HTTPException(status_code=400, detail=f"Для культуры '{crop_name}' нет обученной ИИ-модели.")

    mock_disease_code = "tomato_late_blight"
    mock_confidence = 0.962

    rec = db.query(PlantDiseaseRecommendation).filter(
        PlantDiseaseRecommendation.disease_code == mock_disease_code).first()

    if rec:
        photo.disease_detected = rec.disease_code
        photo.confidence = mock_confidence
        photo.status = rec.disease_name_ru
        db.commit()
        db.refresh(photo)

        response_data = PlantPhotoResponse.model_validate(photo)
        response_data.disease_name_ru = rec.disease_name_ru
        response_data.treatment = rec.treatment
        return response_data

    raise HTTPException(status_code=500, detail="Ошибка ИИ: Не найдены рекомендации для распознанной болезни.")

@router.get("/{plant_id}/photos", response_model=List[PlantPhotoResponse])
def get_plant_photos(
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

    photos = db.query(PlantPhoto).filter(
        PlantPhoto.plant_id == plant_id
    ).order_by(PlantPhoto.created_at.desc()).all()

    return photos


@router.delete("/photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plant_photo(
        photo_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):

    photo = db.query(PlantPhoto).join(Plant).join(GardenPlot).filter(
        PlantPhoto.id == photo_id,
        GardenPlot.user_id == current_user.id
    ).first()

    if not photo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Фотография не найдена")

    file_path = photo.image_url.lstrip("/")

    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Не удалось удалить файл {file_path} с диска: {e}")

    db.delete(photo)
    db.commit()

    return None
