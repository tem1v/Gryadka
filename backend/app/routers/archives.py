import uuid
from datetime import date
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_user
from app.models import User, GardenPlot, Plant, PlantStatus, SeasonArchive, PlantHarvest
from app.schemas import SeasonArchiveResponse, SeasonArchiveCreate, SeasonYieldStat

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

@router.get("/stats/chart-data/{plant_id}", response_model=List[SeasonYieldStat])
def get_chart_data(
    plant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    current_plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not current_plant or current_plant.plot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Растение не найдено")

    chart_data = []

    past_seasons = db.query(
        SeasonArchive.name.label("season_name"),
        func.sum(Plant.total_yield_amount).label("total_weight")
    ).join(
        Plant, Plant.season_archive_id == SeasonArchive.id
    ).filter(
        Plant.plot.has(user_id=current_user.id),
        func.lower(Plant.name) == func.lower(current_plant.name),
        func.lower(Plant.grade) == func.lower(current_plant.grade)
    ).group_by(SeasonArchive.id, SeasonArchive.name).order_by(SeasonArchive.end_date.asc()).all()

    for row in past_seasons:
        chart_data.append(
            SeasonYieldStat(
                name=row.season_name,
                kg=float(row.total_weight or 0.0)
            )
        )

    current_season_weight = db.query(
        func.sum(PlantHarvest.weight)
    ).join(
        Plant, PlantHarvest.plant_id == Plant.id
    ).filter(
        Plant.plot.has(user_id=current_user.id),
        func.lower(Plant.name) == func.lower(current_plant.name),
        func.lower(Plant.grade) == func.lower(current_plant.grade),
        Plant.season_archive_id == None
    ).scalar() or 0.0

    current_year = str(date.today().year)
    chart_data.append(
        SeasonYieldStat(
            name=f"{current_year} (Текущий)",
            kg=float(current_season_weight)
        )
    )

    return chart_data


