import os
import uuid
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_user
from app.models import User, GardenPlot, PlotType
from app.schemas import GardenPlotResponse

router = APIRouter(prefix="/plots", tags=["Plots"])


# СОЗДАНИЕ УЧАСТКА
@router.post("/", response_model=GardenPlotResponse, status_code=status.HTTP_201_CREATED)
async def create_plot(
        name: str = Form(...),
        type: PlotType = Form(...),
        location: str = Form("Казань"),
        file: Optional[UploadFile] = File(None),  # Фото не обязательно
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    image_url = None

    # Если фронтенд прикрепил файл, сохраняем его на диск
    if file:
        file_extension = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"images/plots/{filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image_url = f"/images/plots/{filename}"

    # Создаем запись в БД
    plot_id = str(uuid.uuid4())
    new_plot = GardenPlot(
        id=plot_id,
        user_id=current_user.id,
        name=name,
        type=type,
        location=location,
        image_url=image_url
    )

    db.add(new_plot)
    db.commit()
    db.refresh(new_plot)

    return GardenPlotResponse.model_validate(new_plot)


# ПОЛУЧИТЬ ВСЕ УЧАСТКИ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
@router.get("/", response_model=List[GardenPlotResponse])
def get_all_my_plots(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    plots = db.query(GardenPlot).filter(GardenPlot.user_id == current_user.id).all()
    return plots


# ПОЛУЧИТЬ УЧАСТОК ПО ID
@router.get("/{plot_id}", response_model=GardenPlotResponse)
def get_single_plot(
        plot_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    plot = db.query(GardenPlot).filter(GardenPlot.id == plot_id, GardenPlot.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Участок не найден или у вас нет к нему доступа"
        )
    return plot

# ОБНОВЛЕНИЕ УЧАСТКА
@router.put("/{plot_id}", response_model=GardenPlotResponse)
async def update_plot(
        plot_id: str,
        name: Optional[str] = Form(None),
        type: Optional[PlotType] = Form(None),
        location: Optional[str] = Form(None),
        file: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    plot = db.query(GardenPlot).filter(GardenPlot.id == plot_id, GardenPlot.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Участок не найден или у вас нет к нему доступа"
        )

    if name is not None:
        plot.name = name
    if type is not None:
        plot.type = type
    if location is not None:
        plot.location = location

    if file:
        if plot.image_url:
            old_path = plot.image_url.lstrip("/")
            if os.path.exists(old_path):
                try:
                    os.remove(old_path)
                except Exception as e:
                    print(f"Не удалось удалить старый файл {old_path}: {e}")

        file_extension = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"images/plots/{filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        plot.image_url = f"/images/plots/{filename}"

    db.commit()
    db.refresh(plot)

    return GardenPlotResponse.model_validate(plot)


# УДАЛИТЬ УЧАСТОК
@router.delete("/{plot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plot(
        plot_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    plot = db.query(GardenPlot).filter(GardenPlot.id == plot_id, GardenPlot.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Участок не найден или у вас нет к нему доступа"
        )

    if plot.image_url:
        file_path = plot.image_url.lstrip("/")
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Не удалось удалить файл {file_path}: {e}")

    db.delete(plot)
    db.commit()

    return None