import uuid
from datetime import date
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_user
from app.models import User, GardenPlot, Plant
from app.models import PlantStatus # Твой Enum статусов растений
from app.models import SeasonArchive
from app.schemas import SeasonArchiveResponse, SeasonArchiveCreate

router = APIRouter(prefix="/archives", tags=["Season Archives"])

@router.post("/plot/{garden_plot_id}", response_model=SeasonArchiveResponse)
def archive_plot_season(
    garden_plot_id: str,
    archive_data: SeasonArchiveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plot = db.query(GardenPlot).filter(GardenPlot.id == garden_plot_id, GardenPlot.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Участок не найден")

    active_plants = db.query(Plant).filter(
        Plant.garden_plot_id == garden_plot_id,
        Plant.season_archive_id == None
    ).all()

    if not active_plants:
        raise HTTPException(status_code=400, detail="На этом участке нет активных растений для архивации")

    start_date = min([p.created_at.date() for p in active_plants])
    end_date = date.today()

    archive_id = str(uuid.uuid4())
    new_archive = SeasonArchive(
        id=archive_id,
        garden_plot_id=garden_plot_id,
        name=archive_data.name,
        start_date=start_date,
        end_date=end_date
    )
    db.add(new_archive)

    for plant in active_plants:
        plant.season_archive_id = archive_id
        plant.status = PlantStatus.harvested

    db.commit()
    db.refresh(new_archive)
    return new_archive


@router.get("/plot/{garden_plot_id}", response_model=List[SeasonArchiveResponse])
def get_plot_archives(
    garden_plot_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plot = db.query(GardenPlot).filter(GardenPlot.id == garden_plot_id, GardenPlot.user_id == current_user.id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Участок не найден")

    archives = db.query(SeasonArchive).filter(SeasonArchive.garden_plot_id == garden_plot_id).all()
    return archives
