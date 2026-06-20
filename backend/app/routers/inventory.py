import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_user
from app.models import User, InventoryItem
from app.schemas import InventoryItemResponse, InventoryItemCreate, InventoryItemUpdate

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.post("/", response_model=InventoryItemResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    item_data: InventoryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_item = InventoryItem(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        name=item_data.name,
        item_type=item_data.item_type,
        quantity=item_data.quantity,
        location=item_data.location,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.get("/", response_model=List[InventoryItemResponse])
def get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = db.query(InventoryItem).filter(InventoryItem.user_id == current_user.id).all()
    return items


@router.put("/{item_id}", response_model=InventoryItemResponse)
def update_inventory_item(
    item_id: str,
    item_data: InventoryItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id, InventoryItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Предмет не найден в вашем инвентаре")

    if item_data.name is not None: item.name = item_data.name
    if item_data.item_type is not None: item.item_type = item_data.item_type
    if item_data.quantity is not None: item.quantity = item_data.quantity

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id, InventoryItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Предмет не найден")

    db.delete(item)
    db.commit()
    return None