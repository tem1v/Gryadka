import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_user
from app.models import User, Plant
from app.models import PlantHarvest
from app.schemas import HarvestResponse, HarvestCreate, HarvestUpdate

router = APIRouter(prefix="/harvests", tags=["Harvest Logs"])

@router.post("/", response_model=HarvestResponse, status_code=status.HTTP_201_CREATED)
def create_harvest(
    data: HarvestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plant = db.query(Plant).filter(Plant.id == data.plant_id).first()
    if not plant or plant.plot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Растение не найдено")

    new_log = PlantHarvest(
        id=str(uuid.uuid4()),
        plant_id=data.plant_id,
        weight=data.weight,
        harvest_date=data.harvest_date
    )
    if plant.total_yield_amount is None:
        plant.total_yield_amount = 0.0
    plant.total_yield_amount += data.weight
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.get("/plant/{plant_id}", response_model=List[HarvestResponse])
def get_plant_harvests(
    plant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant or plant.plot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Растение не найдено")

    return db.query(PlantHarvest).filter(PlantHarvest.plant_id == plant_id).order_by(PlantHarvest.harvest_date.desc()).all()

@router.put("/{harvest_id}", response_model=HarvestResponse)
def update_harvest(
    harvest_id: str,
    data: HarvestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = db.query(PlantHarvest).filter(PlantHarvest.id == harvest_id).first()
    if not log or log.plant.plot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(log, key, value)

    db.commit()
    db.refresh(log)
    return log

@router.delete("/{harvest_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_harvest(
    harvest_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = db.query(PlantHarvest).filter(PlantHarvest.id == harvest_id).first()
    if not log or log.plant.plot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    if log.plant.total_yield_amount is not None:
        log.plant.total_yield_amount -= log.weight
        if log.plant.total_yield_amount < 0:
            log.plant.total_yield_amount = 0.0
    db.delete(log)
    db.commit()
    return None

