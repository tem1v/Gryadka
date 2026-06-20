from app.schemas import AIResponse
from app.services.ai_service import AIService
from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import PlantDiseaseRecommendation
from app.schemas import AIResponse

router = APIRouter()
ai_service = AIService()

@router.post("/process", response_model=AIResponse)
async def process_images(
        files: List[UploadFile] = File(...),
        plant: str = Form(...),  # Например: "Томат"
        db: Session = Depends(get_db)
):
    if not files:
        raise HTTPException(status_code=400, detail="Файлы не загружены")

    results = await ai_service.process_images(files, plant)

    detected_disease_name = results["overall"]["label"]

    recommendation = db.query(PlantDiseaseRecommendation).filter(
        PlantDiseaseRecommendation.crop_name == plant,
        func.lower(PlantDiseaseRecommendation.disease_name_ru) == func.lower(detected_disease_name)
    ).first()

    if recommendation:
        results["overall"]["disease_name_ru"] = recommendation.disease_name_ru
        results["overall"]["description"] = recommendation.description
        results["overall"]["treatment"] = recommendation.treatment
    else:
        results["overall"]["disease_name_ru"] = detected_disease_name
        results["overall"]["description"] = "Специфических симптомов болезни не обнаружено."
        results["overall"]["treatment"] = "Продолжайте плановый уход, полив и обеспечение светового режима."

    return {
        "data": results
    }

