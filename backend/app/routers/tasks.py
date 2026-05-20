import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_user
from app.models import User, GardenPlot
from app.models import GardenTask
from app.schemas import TaskResponse, TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
        task_data: TaskCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    plot = db.query(GardenPlot).filter(
        GardenPlot.id == task_data.garden_plot_id,
        GardenPlot.user_id == current_user.id
    ).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Участок не найден")

    new_task = GardenTask(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        garden_plot_id=task_data.garden_plot_id,
        plant_name=task_data.plant_name,
        plant_grade=task_data.plant_grade,
        location=task_data.location,
        task_tag=task_data.task_tag,
        task_date=task_data.task_date,
        task_time=task_data.task_time,
        send_email_notification=task_data.send_email_notification
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return TaskResponse.model_validate(new_task)


@router.get("/", response_model=List[TaskResponse])
def get_tasks(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    tasks = db.query(GardenTask).filter(GardenTask.user_id == current_user.id).all()
    return [TaskResponse.model_validate(t) for t in tasks]


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
        task_id: str,
        task_data: TaskUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    task = db.query(GardenTask).filter(GardenTask.id == task_id, GardenTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")

    update_dict = task_data.model_dump(exclude_unset=True)

    for key, value in update_dict.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
        task_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    task = db.query(GardenTask).filter(GardenTask.id == task_id, GardenTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")

    db.delete(task)
    db.commit()
    return None
